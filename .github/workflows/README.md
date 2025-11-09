# GitHub Actions Workflows

This directory contains CI/CD workflows for the project.

## Workflows

### 1. `test.yml` - Simple Test Runner

**Triggers:** Push and PR to `axai/test-cases` branch

**What it does:**

- Runs on Node.js 18.x and 20.x
- Installs dependencies with pnpm
- Runs the test suite
- Uploads test results as artifacts

**Usage:**

```bash
# Triggered automatically on push to axai/test-cases
git push origin axai/test-cases
```

### 2. `ci.yml` - Complete CI Pipeline

**Triggers:** Push and PR to `axai/test-cases`, `main`, and `master` branches

**Jobs:**

#### Lint & Type Check

- Runs Biome linter
- Performs TypeScript type checking

#### Test

- Runs on Node.js 18.x and 20.x
- Executes full test suite with coverage
- Uploads coverage to Codecov (optional)
- Uploads test results as artifacts

#### Build

- Runs after lint and test pass
- Builds the Next.js application
- Uploads build artifacts

**Usage:**

```bash
# Triggered automatically on push
git push origin axai/test-cases

# Or manually trigger from GitHub Actions tab
```

## Environment Variables

Both workflows use:

- `NODE_ENV: "test"` - Sets Node environment to test
- `SKIP_ENV_VALIDATION: "true"` - Skips environment validation

## Artifacts

### Test Results

- **Name:** `test-results-node-{version}`
- **Contents:** Coverage reports and test results
- **Retention:** 30 days

### Build Output

- **Name:** `build-output`
- **Contents:** Next.js build files (.next/)
- **Retention:** 7 days

## Adding Secrets

If your tests require environment variables, add them in:
**GitHub Repository → Settings → Secrets and variables → Actions**

Example secrets to add:

```
AUTH_SECRET
BASEURL_API
```

Then update the workflow:

```yaml
env:
  AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
  BASEURL_API: ${{ secrets.BASEURL_API }}
```

## Status Badges

Add to your README.md:

```markdown
![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Run%20Tests/badge.svg?branch=axai/test-cases)
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

## Local Testing

Test the workflow locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
choco install act-cli  # Windows

# Run the test workflow
act -j test

# Run the full CI workflow
act -j lint
act -j test
act -j build
```

## Troubleshooting

### Tests failing in CI but passing locally

- Check Node.js version matches
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Build failing

- Check if `SKIP_ENV_VALIDATION` is set
- Verify all required secrets are configured
- Check build logs for specific errors

### Slow tests

- Tests run with `--maxWorkers=2` to limit parallelization
- Adjust in workflow if needed: `pnpm test --maxWorkers=4`
