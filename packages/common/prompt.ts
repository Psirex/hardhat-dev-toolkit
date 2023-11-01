import prompts from "prompts";

interface SelectChoice {
  value: string;
  title: string;
}

interface SecretOptions {
  invisible?: boolean; // false by default
}

interface PasswordOptions {
  confirmation?: boolean; // true by default
}

class OperationAbortedError extends Error {
  constructor() {
    super("Operation was aborted by the user");
  }
}

class PasswordConfirmationMismatchError extends Error {
  constructor() {
    super("Password confirmation does not mismatch the password. Aborting...");
  }
}

const DEFAULT_PROMPTS_OPTIONS = {
  onCancel() {
    throw new OperationAbortedError();
  },
};

async function confirm(message?: string) {
  const { isConfirmed } = await prompts(
    {
      type: "confirm",
      name: "isConfirmed",
      message: message ?? "Confirm?",
    },
    DEFAULT_PROMPTS_OPTIONS
  );
  return isConfirmed;
}

async function select(message: string, choices: SelectChoice[]) {
  const { value } = await prompts(
    {
      name: "value",
      type: "select",
      message,
      choices,
    },
    DEFAULT_PROMPTS_OPTIONS
  );
  return value;
}

async function secret(message: string, options?: SecretOptions): Promise<string> {
  const { value } = await prompts(
    {
      name: "value",
      message,
      type: options?.invisible === true ? "invisible" : "password",
    },
    DEFAULT_PROMPTS_OPTIONS
  );
  return value;
}

async function password(message: string, options: PasswordOptions): Promise<string> {
  const password = await secret(message ?? "Enter the password:", {
    invisible: true,
  });

  if (options.confirmation ?? true) {
    const confirmation = await secret("Confirm the password:", {
      invisible: true,
    });
    if (password !== confirmation) {
      throw new PasswordConfirmationMismatchError();
    }
  }

  return password;
}

export default {
  secret,
  select,
  confirm,
  password,
};
