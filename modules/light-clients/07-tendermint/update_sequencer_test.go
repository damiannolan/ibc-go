package tendermint_test

import (
	abci "github.com/cometbft/cometbft/abci/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"

	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	ibctesting "github.com/cosmos/ibc-go/v8/testing"
)

// TestSequencerUpgrade performs an ibc tendermint client upgrade where the validator set changes from size 4 to 1 in one block (greater than 1/3).
// Example flow:
// block 100 -> return ValidatorUpdates to comet (these validator updates are refectled as nextValsHash in h+1, and valsHash in h+2)
// block 101 -> Header { valhash: (large valset) nextValsHash: updates }
// block 102 -> Header { valshash: updates }
//
// when there is a block header where signer is a single sequencer,
// there is not enough overlap (1/3) of trusted validators signers in order to update to that block header.
// therefore we must add the consensus state for the specific height where the comet validator set signed off on the nextValsHash being the sequencer.
func (suite *TendermintTestSuite) TestSequencerUpgrade() {
	var path *ibctesting.Path

	suite.Run("test ibc sequencer upgrade", func() {
		suite.SetupTest()
		path = ibctesting.NewPath(suite.chainA, suite.chainB)

		suite.coordinator.SetupClients(path)

		// NOTE: we hijack finalizeBlock here to inject validatorUpdates and have them propagated in cometbft headers
		res, err := suite.chainA.App.FinalizeBlock(&abci.RequestFinalizeBlock{
			Height:             suite.chainA.CurrentHeader.Height,
			Time:               suite.chainA.CurrentHeader.GetTime(),
			NextValidatorsHash: suite.chainA.NextVals.Hash(),
		})
		suite.Require().NoError(err)

		validatorsProto, err := suite.chainA.Vals.ToProto()
		suite.Require().NoError(err)

		// assign VP of 0 to vals 1-3, leaving us with a single validator/sequencer at index 0
		validatorUpdates := []abci.ValidatorUpdate{
			{
				PubKey: validatorsProto.Validators[1].PubKey,
				Power:  0,
			},
			{
				PubKey: validatorsProto.Validators[2].PubKey,
				Power:  0,
			},
			{
				PubKey: validatorsProto.Validators[3].PubKey,
				Power:  0,
			},
		}

		res.ValidatorUpdates = validatorUpdates

		// commit upgrade block calls Commit() and applys validator set changes to next block header
		// note that validator set changes are reflected in n+1 nextValsHash, and n+2 valsHash
		// e.g. block 100 -> return []ValidatorUpdates to cometbft
		suite.commitUpgradeBlock(suite.chainA, res)

		trustedHeight := suite.chainA.CurrentHeader.GetHeight()

		// This client update is signed off by the validator set, with the nextValsHash as the sequencer
		// This func(UpdateClient) calls commit block on chain A
		// e.g. block 101 -> Header { ValsHash: (valset) nextValsHash: (sequencer) }
		err = path.EndpointB.UpdateClient()
		suite.Require().NoError(err)

		// e.g. block 102 -> Header { ValsHash: (sequencer), nextValsHash: (sequencer) }
		suite.chainA.NextBlock()

		// WORKAROUND(testing lib): Construct client update header with trusted valset as sequencer
		// And trusted height as last stored counterparty consensus state
		header, err := suite.chainB.ConstructUpdateTMClientHeader(suite.chainA, path.EndpointB.ClientID)
		suite.Require().NoError(err)

		// trusted validators is the sequencer only. this must match our trusted consensus state { nextValsHash }
		// stored on the counterparty chain. trusted height is used to retrieve that consensus state.
		// ConsensusState { nextValsHash: (sequencer) }
		header.TrustedValidators = suite.chainA.LastHeader.ValidatorSet
		header.TrustedHeight = clienttypes.NewHeight(1, uint64(trustedHeight))

		// This client update is signed off by the sequencer
		msgUpdateClient, err := clienttypes.NewMsgUpdateClient(
			path.EndpointB.ClientID, header,
			path.EndpointB.Chain.SenderAccount.GetAddress().String(),
		)
		suite.Require().NoError(err)

		result, err := suite.chainB.SendMsgs(msgUpdateClient)
		suite.Require().NoError(err)
		suite.Require().NotNil(result)
	})
}

func (suite *TendermintTestSuite) commitUpgradeBlock(chain *ibctesting.TestChain, res *abci.ResponseFinalizeBlock) {
	_, err := chain.App.Commit()
	suite.Require().NoError(err)

	// set the last header to the current header
	// use nil trusted fields
	chain.LastHeader = chain.CurrentTMClientHeader()

	// val set changes returned from previous block get applied to the next validators
	// of this block. See tendermint spec for details.
	chain.Vals = chain.NextVals
	chain.NextVals = ibctesting.ApplyValSetChanges(chain, chain.Vals, res.ValidatorUpdates)

	// increment the proposer priority of validators
	chain.Vals.IncrementProposerPriority(1)

	// increment the current header
	chain.CurrentHeader = cmtproto.Header{
		ChainID: chain.ChainID,
		Height:  chain.App.LastBlockHeight() + 1,
		AppHash: chain.App.LastCommitID().Hash,
		// NOTE: the time is increased by the coordinator to maintain time synchrony amongst
		// chains.
		Time:               chain.CurrentHeader.Time,
		ValidatorsHash:     chain.Vals.Hash(),
		NextValidatorsHash: chain.NextVals.Hash(),
		ProposerAddress:    chain.Vals.Proposer.Address,
	}
}
