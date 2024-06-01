class CreateIssueError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
        this.name = "CreateIssueError";
    }
}

class MissingEnvVariablesError extends Error {
    constructor() {
        super("GITHUB_USERNAME, GITHUB_REPO, and GITHUB_TOKEN must be set");
        this.name = "MissingEnvVariablesError";
    }
}

interface Env {
    GITHUB_USERNAME: string;
    GITHUB_REPO: string;
    GITHUB_TOKEN: string;
}