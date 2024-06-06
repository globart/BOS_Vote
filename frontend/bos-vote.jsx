initState({
  candidateName: "",
  voterWallet: "",
  adminWallet: "",
  voterMessage: "",
  adminMessage: "",
});
const accountId = props.wallet_id || context.accountId;
const contract = "dev1337228.testnet";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 18px;
  text-align: left;
`;

const Thead = styled.thead`
  background-color: teal;
  color: white;
`;

const Th = styled.th`
  padding: 12px 15px;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #ddd;
  &:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  &:last-of-type {
    border-bottom: 2px solid teal;
  }
`;

const isSuperAdmin = Near.view(contract, "isSuperAdmin", {
  user: accountId,
});
const isAdmin = Near.view(contract, "isAdmin", {
  user: accountId,
});
const candidates = Near.view(contract, "getCandidates", {});
const votes = Near.view(contract, "getVotes", {});
console.log({ votes });
console.log({ candidates });

const canVote = Near.view(contract, "canVote", {
  user: accountId,
});
const castVote = ({ target }) => {
  Near.call(contract, "castVote", {
    vote: target.value,
    user: accountId,
  });
};

const onAdminChange = ({ target }) => {
  State.update({ adminWallet: target.value });
};
const validateAdmin = () => {
  let isAdmin = Near.view(contract, "isAdmin", {
    user: state.adminWallet,
  });
  if (isAdmin) {
    State.update({
      adminMessage: `Wallet ${state.adminWallet} is already admin`,
    });
  } else {
    State.update({
      adminMessage: `Wallet ${state.adminWallet} isn't admin yet`,
    });
  }
};
const addAdmin = () => {
  Near.call(contract, "addAdmin", {
    newAdmin: state.adminWallet,
    user: accountId,
  });
};
const deleteAdmin = () => {
  Near.call(contract, "deleteAdmin", {
    admin: state.adminWallet,
    user: accountId,
  });
};

const onCandidateChange = ({ target }) => {
  State.update({ candidateName: target.value });
};
const addCandidate = () => {
  Near.call(contract, "addCandidate", {
    candidate: state.candidateName,
    user: accountId,
  });
};
const deleteCandidate = ({ target }) => {
  Near.call(contract, "deleteCandidate", {
    candidateId: target.value,
    user: accountId,
  });
};

const onVoterChange = ({ target }) => {
  State.update({ voterWallet: target.value });
};
const validateVoter = () => {
  let isVoter = Near.view(contract, "isVoter", {
    user: state.voterWallet,
  });
  if (isVoter) {
    State.update({
      voterMessage: `Wallet ${state.voterWallet} is already voter`,
    });
  } else {
    State.update({
      voterMessage: `Wallet ${state.voterWallet} isn't voter yet`,
    });
  }
};
const addVoter = () => {
  Near.call(contract, "addVoter", {
    voter: state.voterWallet,
    user: accountId,
  });
};
const deleteVoter = () => {
  Near.call(contract, "deleteVoter", {
    voter: state.voterWallet,
    user: accountId,
  });
};

const clearPools = () => {
  Near.call(contract, "clearPools", {
    user: accountId,
  });
};

return (
  <>
    <h1>Voting App</h1>
    {isSuperAdmin && (
      <div>
        <button style={{ backgroundColor: "darkred" }} onClick={clearPools}>
          Clear Pools
        </button>
        <input
          type="text"
          placeholder="Input admin wallet (wallet.testnet)"
          onChange={onAdminChange}
        />
        <button onClick={addAdmin} value={adminValue}>
          Add Admin
        </button>
        <button style={{ backgroundColor: "red" }} onClick={deleteAdmin}>
          Delete Admin
        </button>
        <button
          style={{ backgroundColor: "purple" }}
          onClick={validateAdmin}
          value={adminWallet}
        >
          Validate Admin
        </button>
        {state.adminMessage}
      </div>
    )}
    <Table>
      <Thead>
        <Tr>
          <Th>Candidate</Th>
          <Th>Votes</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <tbody>
        {candidates.map((candidate, index) => (
          <Tr key={index}>
            <Td>{candidate[1]}</Td>
            <Td>
              {votes[index] && votes[index][0] == index.toString()
                ? votes[index][1].length
                : 0}
            </Td>
            <Td>
              {canVote && (
                <button onClick={castVote} value={index}>
                  Add Vote
                </button>
              )}
              {isAdmin && (
                <button
                  style={{ backgroundColor: "red" }}
                  onClick={deleteCandidate}
                  value={index}
                >
                  Delete Candidate
                </button>
              )}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
    {isAdmin && (
      <div>
        <input
          type="text"
          placeholder="Input candidate name"
          onChange={onCandidateChange}
        />
        <button onClick={addCandidate} value={candidateName}>
          Add Candidate
        </button>
        <br></br>
        <br></br>
        <input
          type="text"
          placeholder="Input voter wallet (wallet.testnet)"
          onChange={onVoterChange}
        />
        <button onClick={addVoter} value={voterWallet}>
          Add Voter
        </button>
        <button
          style={{ backgroundColor: "red" }}
          onClick={deleteVoter}
          value={voterWallet}
        >
          Delete Voter
        </button>
        <button
          style={{ backgroundColor: "purple" }}
          onClick={validateVoter}
          value={voterWallet}
        >
          Validate Voter
        </button>
        {state.voterMessage}
      </div>
    )}
  </>
);

