export const authPaths = {
  "/auth/signup": {
    post: {
      summary: "Register a new user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password", "name"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", format: "password" },
                name: { type: "string" },
                phone_number: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
        },
      },
    },
  },

  "/auth/confirm": {
    post: {
      summary: "Confirm user registration",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "confirmation_code"],
              properties: {
                email: { type: "string", format: "email" },
                confirmation_code: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Email confirmed successfully",
        },
      },
    },
  },

  "/auth/resend-code": {
    post: {
      summary: "Resend confirmation code to user's email",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Confirmation code resent successfully",
        },
      },
    },
  },

  "/auth/login": {
    post: {
      summary: "Login a user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
        },
      },
    },
  },

  "/auth/logout": {
    post: {
      summary: "Logout a user",
      tags: ["Auth"],
      responses: {
        200: {
          description: "Logout successful",
        },
      },
    },
  },

  "/auth/forgot-password": {
    post: {
      summary: "Initiate forgot password process",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Forgot password initiated successfully",
        },
      },
    },
  },

  "/auth/confirm-forgot-password": {
    post: {
      summary: "Confirm password reset with code",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "confirmation_code", "new_password"],
              properties: {
                email: { type: "string", format: "email" },
                confirmation_code: { type: "string" },
                new_password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset successfully",
        },
      },
    },
  },

  "/auth/change-password": {
    put: {
      summary: "Change user password",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["previous_password", "new_password"],
              properties: {
                previous_password: { type: "string", format: "password" },
                new_password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password changed successfully",
        },
      },
    },
  },

  "/auth/change-email": {
    put: {
      summary: "Change user email",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Email updated successfully",
        },
      },
    },
  },

  "/auth/token": {
    post: {
      summary: "Refresh access token",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refresh_token"],
              properties: {
                refresh_token: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Token refreshed successfully",
        },
      },
    },
  },

  "/auth/get-profile": {
    get: {
      summary: "Get user profile",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Profile fetched successfully",
        },
      },
    },
  },

  "/auth/update-profile": {
    patch: {
      summary: "Update user profile",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated successfully",
        },
      },
    },
  },

  "/auth/delete-user": {
    delete: {
      summary: "Delete user account",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User deleted successfully",
        },
      },
    },
  },
};
