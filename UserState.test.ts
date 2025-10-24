import { beforeEach, describe, expect, it } from "vitest";

import { defineState, ref as pgsRef, type Infer } from "pretty-good-state";
import { ref } from "valtio";

type User = {
  name: {
    first: string;
    last: string;
  };
};

export const UserStatePGS = defineState({
  data: null as User | null,
  serverData: pgsRef(null as User | null),
  saveData() {
    if (!this.data) return;
    this.setServerData(this.data);
  },
  setServerData(data?: User) {
    const _data = data ?? this.data;
    this.serverData = _data ? pgsRef(structuredClone(_data)) : null;
  },
  get hasChanges() {
    return JSON.stringify(this.serverData) !== JSON.stringify(this.data);
  },
});

export class UserStateValtio {
  constructor(data?: User) {
    this.data = data ?? null;
  }
  data: User | null = null;
  serverData: User | null = null;
  saveData() {
    if (!this.data) return;
    this.setServerData(this.data);
  }
  setServerData(data?: User) {
    const _data = data ?? this.data;
    this.serverData = _data ? ref(structuredClone(_data)) : null;
  }
  get hasChanges() {
    return JSON.stringify(this.serverData) !== JSON.stringify(this.data);
  }
}

describe("UserState - Valtio", () => {
  let userState: UserStateValtio;
  beforeEach(() => {
    userState = new UserStateValtio({
      name: {
        first: "John",
        last: "Doe",
      },
    });
  });

  it("should set server data", () => {
    userState.setServerData({
      name: {
        first: "Jane",
        last: "Doe",
      },
    });
    expect(userState.serverData?.name.first).toBe("Jane");
  });

  it("should save data", () => {
    userState.saveData();
    expect(userState.serverData?.name.first).toBe("John");
    expect(userState.hasChanges).toBe(false);
  });

  it("should have changes", () => {
    userState.data!.name.first = "Jane";
    expect(userState.hasChanges).toBe(true);
  });
});

describe("UserState - Pretty Good State", () => {
  let userState: Infer<typeof UserStatePGS>;
  beforeEach(() => {
    userState = UserStatePGS((state) => {
      state.data = {
        name: {
          first: "John",
          last: "Doe",
        },
      };
    });
  });

  it("should set server data", () => {
    userState.setServerData({
      name: {
        first: "Jane",
        last: "Doe",
      },
    });
    expect(userState.serverData?.name.first).toBe("Jane");
  });

  it("should save data", () => {
    userState.saveData();
    expect(userState.serverData?.name.first).toBe("John");
    expect(userState.hasChanges).toBe(false);
  });

  it("should have changes", () => {
    userState.data!.name.first = "Jane";
    expect(userState.hasChanges).toBe(true);
  });
});
