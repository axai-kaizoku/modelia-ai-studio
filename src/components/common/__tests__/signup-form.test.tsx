import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import SignupForm from "../signup-form";
import { signup } from "@/server/api/login/actions";
import "@testing-library/jest-dom";

jest.mock("next-auth/react");
jest.mock("@/server/api/login/actions");

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignup = signup as jest.MockedFunction<typeof signup>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("SignupForm", () => {
  const mockOnSuccess = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders name, email and password fields", () => {
    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it("renders create account button", () => {
    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("validates name length", async () => {
    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it("validates password requirements", async () => {
    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("requires password to contain letters and numbers", async () => {
    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "onlyletters" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least 1 letter and 1 number/i)).toBeInTheDocument();
    });
  });

  it("creates account and logs in on success", async () => {
    mockSignup.mockResolvedValue({
      error: false,
      data: {
        id: "1",
        name: "John Doe",
        email: "test@example.com",
        role: "user",
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
    });

    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "Password123",
      });
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it("shows loading toast during signup and login", async () => {
    mockSignup.mockResolvedValue({
      error: false,
      data: {} as any,
    });

    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith(expect.stringContaining("Logging you in"));
    });
  });

  it("shows success toast after successful login", async () => {
    mockSignup.mockResolvedValue({
      error: false,
      data: {} as any,
    });

    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Login successful"));
    });
  });

  it("shows error message on signup failure", async () => {
    mockSignup.mockResolvedValue({
      error: true,
      message: "Email already exists",
    });

    render(<SignupForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />, {
      wrapper: createWrapper(),
    });

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already exists");
    });
  });
});
