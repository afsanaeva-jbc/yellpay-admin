

export const dummyUser = {
  id: 1,
  name: "John Doe",
  name_furigana: "ジョン・ドー",
  email: "john.doe@example.com",
  phone: "+1234567890",
  avatar: "/placeholder-avatar.png",
  active_role: {
    id: 1,
    name: "admin",
    display_name: "Administrator",
    is_reserved: true
  },
  roles: [
    {
      id: 1,
      name: "admin",
      display_name: "Administrator",
      description: "System administrator",
      is_reserved: true
    }
  ],
  permissions: ["read", "write", "delete"],
  schoolName: "Demo School"
};

export const dummyAuthState = {
  user: dummyUser,
  token: "dummy-jwt-token-12345",
  message: "Login successful",
  password_reset_token: null,
  reset_message: null,
  roles: [
    {
      id: 1,
      name: "admin",
      display_name: "Administrator",
      description: "System administrator",
      is_reserved: true
    },
    {
      id: 2,
      name: "teacher",
      display_name: "Teacher",
      description: "School teacher",
      is_reserved: false
    }
  ],
  grades: [],
  users: [dummyUser],
  isAuthenticated: true
};

export const dummyNotifications = [
  {
    id: "1",
    title: "System Update",
    message: "System will be updated tonight",
    type: "info",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "New Feature",
    message: "Check out our new dashboard feature",
    type: "success",
    read: true,
    createdAt: new Date().toISOString()
  }
];

export const dummyGrades = [
  {
    id: "1",
    subject: "Mathematics",
    grade: "A",
    marks: 95,
    totalMarks: 100,
    date: "2024-01-15"
  },
  {
    id: "2",
    subject: "English",
    grade: "B+",
    marks: 87,
    totalMarks: 100,
    date: "2024-01-16"
  }
];

// Add more dummy data as needed for your application