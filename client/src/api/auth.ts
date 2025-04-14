interface AuthBody {
  name?: string;
  surname?: string;
  email: string;
  password: string;
}

export const register = async (body: AuthBody) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return { data, ok: response.ok };
  } catch (error) {
    console.error("Register error:", error);
    return { data: { error: "Network error" }, ok: false };
  }
};

export const login = async (body: AuthBody) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return { data, ok: response.ok };
  } catch (error) {
    console.error("Login error:", error);
    return { data: { error: "Network error" }, ok: false };
  }
};

export const fetchCurrentUser = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/current-user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401 || response.status === 403) {
      throw new Error("Unauthorized");
    }

    if (response.status === 404) {
      throw new Error("UserNotFound");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch current user", error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to verify email:", error);
    return { error: "Network error" };
  }
};

export const resendVerification = async (token: string, email: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to verify email:", error);
    return { error: "Network error" };
  }
};
