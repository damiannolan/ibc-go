"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2760],{91128:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>l});var t=s(85893),i=s(11151);const o={},c="ADR 005: UpdateClient Events - ClientState Consensus Heights",r={id:"adr-005-consensus-height-events",title:"ADR 005: UpdateClient Events - ClientState Consensus Heights",description:"Changelog",source:"@site/architecture/adr-005-consensus-height-events.md",sourceDirName:".",slug:"/adr-005-consensus-height-events",permalink:"/architecture/adr-005-consensus-height-events",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"ADR 004: Lock fee module upon escrow out of balance",permalink:"/architecture/adr-004-ics29-lock-fee-module"},next:{title:"ADR 006: ICS-02 client refactor",permalink:"/architecture/adr-006-02-client-refactor"}},d={},l=[{value:"Changelog",id:"changelog",level:2},{value:"Status",id:"status",level:2},{value:"Context",id:"context",level:2},{value:"Decision",id:"decision",level:2},{value:"Consequences",id:"consequences",level:2},{value:"Positive",id:"positive",level:3},{value:"Negative",id:"negative",level:3},{value:"Neutral",id:"neutral",level:3},{value:"References",id:"references",level:2}];function a(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,i.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"adr-005-updateclient-events---clientstate-consensus-heights",children:"ADR 005: UpdateClient Events - ClientState Consensus Heights"}),"\n",(0,t.jsx)(n.h2,{id:"changelog",children:"Changelog"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"25/04/2022: initial draft"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"status",children:"Status"}),"\n",(0,t.jsx)(n.p,{children:"Accepted"}),"\n",(0,t.jsx)(n.h2,{id:"context",children:"Context"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"ibc-go"})," implementation leverages the ",(0,t.jsx)(n.a,{href:"https://github.com/cosmos/cosmos-sdk/blob/v0.45.4/docs/core/events.md#EventManager",children:"Cosmos-SDK's EventManager"})," to provide subscribers a method of reacting to application specific events.\nSome IBC relayers depend on the ",(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc-go/blob/v3.0.0/modules/core/02-client/keeper/events.go#L33",children:(0,t.jsx)(n.code,{children:"consensus_height"})})," attribute emitted as part of ",(0,t.jsx)(n.code,{children:"UpdateClient"})," events in order to run ",(0,t.jsx)(n.code,{children:"07-tendermint"})," misbehaviour detection by cross-checking the details of the ",(0,t.jsx)(n.em,{children:"Header"})," emitted at a given consensus height against those of the ",(0,t.jsx)(n.em,{children:"Header"})," from the originating chain. This includes such details as:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"SignedHeader"})," containing the commitment root."]}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"ValidatorSet"})," that signed the ",(0,t.jsx)(n.em,{children:"Header"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"TrustedHeight"})," seen by the client at less than or equal to the height of ",(0,t.jsx)(n.em,{children:"Header"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["The last ",(0,t.jsx)(n.code,{children:"TrustedValidatorSet"})," at the trusted height."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Following the refactor of the ",(0,t.jsx)(n.code,{children:"02-client"})," submodule and associated ",(0,t.jsx)(n.code,{children:"ClientState"})," interfaces, it will now be possible for\nlight client implementations to perform such actions as batch updates, inserting ",(0,t.jsx)(n.code,{children:"N"})," number of ",(0,t.jsx)(n.code,{children:"ConsensusState"}),"s into the application state tree with a single ",(0,t.jsx)(n.code,{children:"UpdateClient"})," message. This flexibility is provided in ",(0,t.jsx)(n.code,{children:"ibc-go"})," by the usage of the ",(0,t.jsxs)(n.a,{href:"https://developers.google.com/protocol-buffers/docs/proto3#any",children:["Protobuf ",(0,t.jsx)(n.code,{children:"Any"})]})," field contained within the ",(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc-go/blob/v3.0.0/proto/ibc/core/client/v1/tx.proto#L44",children:(0,t.jsx)(n.code,{children:"UpdateClient"})})," message.\nFor example, a batched client update message serialized as a Protobuf ",(0,t.jsx)(n.code,{children:"Any"})," type for the ",(0,t.jsx)(n.code,{children:"07-tendermint"})," lightclient implementation could be defined as follows:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-protobuf",children:"message BatchedHeaders {\n  repeated Header headers = 1;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["To complement this flexibility, the ",(0,t.jsx)(n.code,{children:"UpdateClient"})," handler will now support the submission of ",(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc/tree/master/spec/core/ics-002-client-semantics#misbehaviour",children:"client misbehaviour"})," by consolidating the ",(0,t.jsx)(n.code,{children:"Header"})," and ",(0,t.jsx)(n.code,{children:"Misbehaviour"})," interfaces into a single ",(0,t.jsx)(n.code,{children:"ClientMessage"})," interface type:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:"// ClientMessage is an interface used to update an IBC client.\n// The update may be done by a single header, a batch of headers, misbehaviour, or any type which when verified produces\n// a change to state of the IBC client\ntype ClientMessage interface {\n  proto.Message\n\n  ClientType() string\n  ValidateBasic() error\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["To support this functionality the ",(0,t.jsx)(n.code,{children:"GetHeight()"})," method has been omitted from the new ",(0,t.jsx)(n.code,{children:"ClientMessage"})," interface.\nEmission of standardised events from the ",(0,t.jsx)(n.code,{children:"02-client"})," submodule now becomes problematic and is two-fold:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"02-client"})," submodule previously depended upon the ",(0,t.jsx)(n.code,{children:"GetHeight()"})," method of ",(0,t.jsx)(n.code,{children:"Header"})," types in order to ",(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc-go/blob/v3.0.0/modules/core/02-client/keeper/client.go#L90",children:"retrieve the updated consensus height"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Emitting a single ",(0,t.jsx)(n.code,{children:"consensus_height"})," event attribute is not sufficient in the case of a batched client update containing multiple ",(0,t.jsx)(n.em,{children:"Headers"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"decision",children:"Decision"}),"\n",(0,t.jsxs)(n.p,{children:["The following decisions have been made in order to provide flexibility to consumers of ",(0,t.jsx)(n.code,{children:"UpdateClient"})," events in a non-breaking fashion:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Return a list of updated consensus heights ",(0,t.jsx)(n.code,{children:"[]exported.Height"})," from the new ",(0,t.jsx)(n.code,{children:"UpdateState"})," method of the ",(0,t.jsx)(n.code,{children:"ClientState"})," interface."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-go",children:"// UpdateState updates and stores as necessary any associated information for an IBC client, such as the ClientState and corresponding ConsensusState.\n// Upon successful update, a list of consensus heights is returned. It assumes the ClientMessage has already been verified.\nUpdateState(sdk.Context, codec.BinaryCodec, sdk.KVStore, ClientMessage) []Height\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Maintain the ",(0,t.jsx)(n.code,{children:"consensus_height"})," event attribute emitted from the ",(0,t.jsx)(n.code,{children:"02-client"})," update handler, but mark as deprecated for future removal. For example, with tendermint lightclients this will simply be ",(0,t.jsx)(n.code,{children:"consensusHeights[0]"})," following a successful update using a single ",(0,t.jsx)(n.em,{children:"Header"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Add an additional ",(0,t.jsx)(n.code,{children:"consensus_heights"})," event attribute, containing a comma separated list of updated heights. This provides flexibility for emitting a single consensus height or multiple consensus heights in the example use-case of batched header updates."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"consequences",children:"Consequences"}),"\n",(0,t.jsx)(n.h3,{id:"positive",children:"Positive"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Subscribers of IBC core events can act upon ",(0,t.jsx)(n.code,{children:"UpdateClient"})," events containing one or more consensus heights."]}),"\n",(0,t.jsxs)(n.li,{children:["Deprecation of the existing ",(0,t.jsx)(n.code,{children:"consensus_height"})," attribute allows consumers to continue to process ",(0,t.jsx)(n.code,{children:"UpdateClient"})," events as normal, with a path to upgrade to using the ",(0,t.jsx)(n.code,{children:"consensus_heights"})," attribute moving forward."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"negative",children:"Negative"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Consumers of IBC core ",(0,t.jsx)(n.code,{children:"UpdateClient"})," events are forced to make future code changes."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"neutral",children:"Neutral"}),"\n",(0,t.jsx)(n.h2,{id:"references",children:"References"}),"\n",(0,t.jsx)(n.p,{children:"Discussions:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc-go/pull/1208#discussion_r839691927",children:"#1208"})}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Issues:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc-go/issues/594",children:"#594"})}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"PRs:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://github.com/cosmos/ibc-go/pull/1285",children:"#1285"})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},11151:(e,n,s)=>{s.d(n,{Z:()=>r,a:()=>c});var t=s(67294);const i={},o=t.createContext(i);function c(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);