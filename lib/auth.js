// Dummy users database
let users = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@oceanlabz.com",
        password: "admin123",
        role: "admin",
        services: ["audio-player", "location-tracker"]
    },
    {
        id: 2,
        name: "John Subscriber",
        email: "user@oceanlabz.com",
        password: "user123",
        role: "subscriber",
        services: ["audio-player"]
    }
];

// Authenticate user with email and password
export function authenticateUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    return {
        success: false,
        error: "Invalid email or password"
    };
}

// Create new user (for signup)
export function createUser(name, email, password, role = "subscriber", services = []) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        return {
            success: false,
            error: "User with this email already exists"
        };
    }

    // Generate new ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // Create new user
    const newUser = {
        id: newId,
        name,
        email,
        password,
        role,
        services
    };

    users.push(newUser);

    return {
        success: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            services: newUser.services
        }
    };
}

// Get all users (for testing)
export function getAllUsers() {
    return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        password: u.password, // Include password for edit functionality
        services: u.services || []
    }));
}

// Get user by ID
export function getUserById(id) {
    const user = users.find(u => u.id === parseInt(id));

    if (user) {
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                password: user.password,
                services: user.services || []
            }
        };
    }

    return {
        success: false,
        error: "User not found"
    };
}

// Update user
export function updateUser(id, userData) {
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
        return {
            success: false,
            error: "User not found"
        };
    }

    // Check if email is being changed and if it already exists
    if (userData.email !== users[userIndex].email) {
        const existingUser = users.find(u => u.email === userData.email && u.id !== parseInt(id));
        if (existingUser) {
            return {
                success: false,
                error: "Email already in use by another user"
            };
        }
    }

    // Update user data
    users[userIndex] = {
        ...users[userIndex],
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        services: userData.services || []
    };

    return {
        success: true,
        user: {
            id: users[userIndex].id,
            name: users[userIndex].name,
            email: users[userIndex].email,
            role: users[userIndex].role,
            services: users[userIndex].services
        }
    };
}

// Delete user
export function deleteUser(id) {
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
        return {
            success: false,
            error: "User not found"
        };
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    return {
        success: true,
        user: {
            id: deletedUser.id,
            name: deletedUser.name,
            email: deletedUser.email
        }
    };
}

// Validate email format
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password) {
    return password.length >= 6;
}
