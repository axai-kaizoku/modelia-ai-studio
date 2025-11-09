import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import LoginForm from "../login-form";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

jest.mock("next-auth/react");
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

describe("LoginForm", () => {
  const mockOnSuccess = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("validates email format", async () => {
    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it("requires password field", async () => {
    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid credentials", async () => {
    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          email: "test@example.com",
          password: "password123",
          redirect: false,
        })
      );
    });
  });

  it("shows error message on login failure", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials", ok: false } as any);

    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("shows loading state during submission", async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {}));

    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("clears error when user starts typing", async () => {
    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();
    });
  });

  it("calls onSuccess and handleClose on successful login", async () => {
    mockSignIn.mockResolvedValue({ error: null, ok: true } as any);

    render(<LoginForm onSuccess={mockOnSuccess} handleClose={mockHandleClose} />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
