import { NearBindgen, near, initialize, view, call, UnorderedMap, UnorderedSet } from "near-sdk-js";

@NearBindgen({})
class VotingContract {
  superadmins = new UnorderedSet<string>("superadmins");
  admins = new UnorderedSet<string>("admins");
  voters = new UnorderedSet<string>("voters");
  candidates = new UnorderedMap<string>("candidates");
  votes = new UnorderedMap<string[]>("votes");

  @initialize({ privateFunction: true })
  init() {
    this.superadmins.set("globart.testnet")
    for (const user of this.superadmins.toArray()) {
      this.admins.set(user);
    }
    this.admins.set("artem-stankov.testnet")

    for (const user of this.admins.toArray()) {
      this.voters.set(user);
    }
    this.voters.set("oksana-kostenko.testnet");
    this.voters.set("andriy-shevchenko.testnet");
    this.voters.set("lesya-franko.testnet");
    this.voters.set("ivan-skovoroda.testnet");
    this.voters.set("lina-ukrainka.testnet");
    this.voters.set("grygoriy-malyshko.testnet");

    this.candidates.set("0", "Володимир Зеленський");
    this.candidates.set("1", "Петро Порошенко");
    this.candidates.set("2", "Проти всіх");

    near.log(`There are ${this.superadmins.length} superadmins, ${this.admins.length} admins, ${this.voters.length} voters`);
  }

  @view({})
  getCandidates(): [string, string][] {
    return this.candidates.toArray();
  }
  @view({})
  getVotes(): [string, string[]][] {
    return this.votes.toArray();
  }
  @view({})
  isSuperAdmin({ user }: { user: string }): boolean {
    if (this.superadmins.contains(user)) {
      near.log(`User ${user} is superadmin`);
      return true;
    }
    else {
      near.log(`User ${user} isn't superadmin`);
      return false;
    }
  }
  @view({})
  isVoter({ user }: { user: string }): boolean {
    if (this.voters.contains(user)) {
      near.log(`User ${user} is voter`);
      return true;
    }
    else {
      near.log(`User ${user} isn't voter`);
      return false;
    }
  }
  @view({})
  isAdmin({ user }: { user: string }): boolean {
    if (this.admins.contains(user)) {
      near.log(`User ${user} is admin`);
      return true;
    }
    else {
      near.log(`User ${user} isn't admin`);
      return false;
    }
  }

  @view({})
  canVote({ user }: { user: string }): boolean {
    if (!this.voters.contains(user)) {
      near.log(`User ${user} isn't voter`);
      return false;
    }
    else {
      for (const params of this.votes.toArray()) {
        if (params[1].includes(user)) {
          return false;
        }
      }
      return true;
    }
  }


  @call({})
  addAdmin({ admin, user }: { admin: string, user: string }) {
    if (!this.superadmins.contains(user)) {
      near.log(`User ${user} isn't superadmin`);
      return;
    }
    else {
      this.admins.set(admin)
      near.log(`Admin ${admin} was added by ${user}`);
    }
  }
  @call({})
  deleteAdmin({ admin, user }: { admin: string, user: string }) {
    if (!this.superadmins.contains(user)) {
      near.log(`User ${user} isn't superadmin`);
      return;
    }
    else {
      this.admins.remove(admin)
      near.log(`Admin ${admin} was deleted by ${user}`);
    }
  }

  @call({})
  addVoter({ voter, user }: { voter: string, user: string }) {
    if (!this.admins.contains(user)) {
      near.log(`User ${user} isn't admin`);
      return;
    }
    else {
      this.voters.set(voter)
      near.log(`Voter ${voter} was added by ${user}`);
    }
  }
  @call({})
  deleteVoter({ voter, user }: { voter: string, user: string }) {
    if (!this.admins.contains(user)) {
      near.log(`User ${user} isn't admin`);
      return;
    }
    else {
      this.voters.remove(voter)
      near.log(`Voter ${voter} was deleted by ${user}`);
    }
  }

  @call({})
  addCandidate({ candidate, user }: { candidate: string, user: string }) {
    if (!this.admins.contains(user)) {
      near.log(`User ${user} isn't admin`);
      return;
    }
    else {
      let new_index = 0;
      if (this.candidates.length > 0) {
        new_index = Math.max(...this.candidates.toArray().map(i => Number(i[0]))) + 1;
      }
      this.candidates.set(new_index.toString(), candidate);
      near.log(`Candidate ${candidate} was added by ${user} with index ${new_index}`);
    }
  }
  @call({})
  deleteCandidate({ candidateId, user }: { candidateId: string, user: string }) {
    if (!this.admins.contains(user)) {
      near.log(`User ${user} isn't admin`);
      return;
    }
    else {
      this.candidates.remove(candidateId);
      near.log(`Candidate ${this.candidates[candidateId]} was deleted by ${user}`);
    }
  }

  @call({})
  castVote({ vote, user }: { vote: string, user: string }) {
    if (this.canVote({ user })) {
      const values = this.votes.get(vote, { defaultValue: [] })
      values.push(user)
      this.votes.set(vote, values)
      near.log(`Vote was cast by ${user}`);
    }
  }

  @call({})
  clearPools({ user }: { user: string }) {
    if (!this.superadmins.contains(user)) {
      near.log(`User ${user} isn't superadmin`);
      return;
    }
    else {
      this.candidates.clear();
      this.votes.clear();
      near.log(`Pools were cleared by ${user}`);
    }
  }
}