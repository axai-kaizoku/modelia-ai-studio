# Studio Component Tests

This directory contains comprehensive tests for the AI Studio components using React Testing Library and Jest.

## Test Coverage

### Main Studio Component (`studio.test.tsx`)

- **Component Rendering**: Tests for upload, prompt, and style components
- **Generate Flow**: Loading state → success → history updated
- **Error Handling**: Retry logic (up to 3 attempts)
- **Abort Functionality**: Tests AbortController cancellation

### Unit Tests

#### ImageUploadPreview (`image-upload-preview.test.tsx`)

- Upload area rendering
- Image preview display
- File selection handling
- Clear functionality
- File type validation
- 8MB size limit

#### GenerationHistory (`generation-history.test.tsx`)

- Empty state display
- History items rendering
- Item restoration
- Loading state
- Item limit (5 items max)

#### GenerationResult (`generation-result.test.tsx`)

- Result image display
- Prompt and style display
- Download functionality
- Timestamp formatting

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test studio.test.tsx
```

## Test Structure

Each test file follows this pattern:

1. **Setup**: Mock dependencies and create test wrappers
2. **Describe blocks**: Group related tests
3. **beforeEach**: Reset mocks before each test
4. **it blocks**: Individual test cases with clear descriptions

## Mocking Strategy

- **Next.js Navigation**: Mocked in `jest.setup.js`
- **NextAuth**: Mocked `signIn` and `signOut` functions
- **API Actions**: Mocked using `jest.mock()`
- **Toast Notifications**: Mocked `sonner` library
- **React Query**: Real implementation with test-specific config

## Key Testing Patterns

### File Upload Testing

```typescript
const file = new File(["dummy"], "test.png", { type: "image/png" });
const input = screen.getByLabelText(/upload/i);
fireEvent.change(input, { target: { files: [file] } });
```

### Async Operations

```typescript
await waitFor(() => {
  expect(screen.getByText("Expected Text")).toBeInTheDocument();
});
```

### User Interactions

```typescript
const button = screen.getByRole("button", { name: /generate/i });
fireEvent.click(button);
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Best Practices

1. **Test user behavior**, not implementation details
2. **Use accessible queries** (getByRole, getByLabelText)
3. **Wait for async updates** with waitFor
4. **Clear mocks** between tests
5. **Test error states** and edge cases
6. **Keep tests isolated** and independent
