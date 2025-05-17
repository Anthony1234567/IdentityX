//
//  LoginView.swift
//  Handles local authentication and transitions to dashboard
//
//  Created by Anthony Martinez on 3/17/25.
//

import SwiftUI
import LocalAuthentication

struct LoginView: View {
    @Binding var isAuthenticated: Bool
    @Binding var loggedInUsername: String

    @State private var username: String = ""
    @State private var password: String = ""
    @State private var authenticationError: String?
    @State private var saveUsername: Bool = false
    @State private var showPassword: Bool = false
    @State private var isLoading: Bool = false

    let loadDelay: Double = 1.5  // Configurable delay for simulated loading

    var body: some View {
        VStack(spacing: 20) {
            // Username field with Face ID button
            ZStack(alignment: .trailing) {
                TextField("Username", text: $username)
                    .padding()
                    .background(RoundedRectangle(cornerRadius: 10).fill(Color(.systemGray6)))

                Button(action: {
                    authenticateWithFaceID()
                }) {
                    Image(systemName: "faceid")
                        .resizable()
                        .frame(width: 25, height: 25)
                        .foregroundColor(.blue)
                        .padding(.trailing, 10)
                }
            }
            .padding(.horizontal)

            // Password field with show/hide toggle
            ZStack(alignment: .trailing) {
                Group {
                    if showPassword {
                        TextField("Password", text: $password)
                    } else {
                        SecureField("Password", text: $password)
                    }
                }
                .padding()
                .background(RoundedRectangle(cornerRadius: 10).fill(Color(.systemGray6)))

                Button(action: {
                    showPassword.toggle()
                }) {
                    Image(systemName: showPassword ? "eye.slash" : "eye")
                        .foregroundColor(.gray)
                        .padding(.trailing, 12)
                }
            }
            .padding(.horizontal)

            // Display error if authentication fails
            if let error = authenticationError {
                Text(error)
                    .foregroundColor(.red)
                    .padding()
            }

            // Toggle to save username
            Toggle("Save Username", isOn: $saveUsername)
                .foregroundColor(.white)
                .padding(.horizontal)

            // Sign-On button with dynamic icon and loading spinner
            Button(action: {
                authenticate()
            }) {
                HStack {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Image(systemName: isAuthenticated ? "lock.open.fill" : "lock.fill")
                        Text("Sign On")
                            .bold()
                    }
                }
                .frame(width: 200, height: 50)
                .background(username.isEmpty || password.isEmpty ? Color.gray : Color.blue)
                .foregroundColor(.white)
                .cornerRadius(25)
            }
            .padding()
            .disabled(username.isEmpty || password.isEmpty || isLoading)

            // Forgot password link
            Button("Forgot Username or Password?") {}
                .foregroundColor(.blue)
                .padding(.top, 10)
                .frame(maxWidth: .infinity)
        }
        .offset(y: isAuthenticated ? -UIScreen.main.bounds.height : 0)
        .opacity(isAuthenticated ? 0 : 1)
        .animation(.easeInOut(duration: 0.4), value: isAuthenticated)
    }

    /// Handles username/password authentication with simulated delay
    func authenticate() {
        if username == "Admin" && password == "password123" {
            isLoading = true
            authenticationError = nil

            DispatchQueue.main.asyncAfter(deadline: .now() + loadDelay) {
                loggedInUsername = "Anthony Martinez"
                withAnimation(.easeInOut(duration: 0.4)) {
                    isAuthenticated = true
                }
                isLoading = false
            }
        } else {
            authenticationError = "Invalid username or password."
        }
    }

    /// Triggers Face ID authentication
    func authenticateWithFaceID() {
        let context = LAContext()
        var error: NSError?

        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Authenticate to access your dashboard") { success, authenticationError in
                DispatchQueue.main.async {
                    if success {
                        loggedInUsername = "Anthony Martinez"
                        isAuthenticated = true
                    } else {
                        self.authenticationError = "Face ID authentication failed."
                    }
                }
            }
        } else {
            authenticationError = "Face ID not available."
        }
    }
}

#Preview {
    LoginView(isAuthenticated: .constant(false), loggedInUsername: .constant(""))
}
