# Debug User Creation Tests Guide

## Quick Start Debugging

### Option 1: Using VS Code Integrated Debugger

1. **Set Breakpoints**:
   - Open `AuthControllerUnitTests.cs`
   - Click in the left margin next to these lines to set breakpoints:
     - Line 67: `System.Diagnostics.Debug.WriteLine("[DEBUG] About to call Register method...");`
     - Line 70: `var result = await _controller.Register(registerRequest);`
     - Line 76: `result.Should().BeOfType<OkObjectResult>();`

2. **Start Debugging**:
   - Press `Ctrl+Shift+D` to open Debug panel
   - Select "Debug Unit Test - Register Valid Nurse User"
   - Press `F5` to start debugging
   - The debugger will stop at your breakpoints

3. **Debug Features Available**:
   - **Step Over** (`F10`): Execute current line
   - **Step Into** (`F11`): Step into method calls
   - **Continue** (`F5`): Continue to next breakpoint
   - **Variables Panel**: View all local variables and their values
   - **Watch Panel**: Add expressions to monitor
   - **Call Stack**: See the execution path

### Option 2: Console Output Debugging

The test already includes debug output statements that will show:
- User registration input data
- Test execution flow
- Results and assertions

### What You Can Debug

**User Creation Test Coverage:**
1. `Register_ValidNurseUser_ReturnsOkResult` - Main user creation test
2. `Register_DifferentUserTypes_AssignsCorrectRoles` - Role assignment testing
3. `Register_SetsCorrectUserProperties` - Property validation
4. `Register_DuplicateEmail_ReturnsBadRequest` - Duplicate handling
5. `Register_IdentityFailure_ReturnsBadRequest` - Error handling

**Debug Information Available:**
- Mock setup verification
- User object creation details
- Role assignment process
- Identity result validation
- HTTP response verification

### Integration vs Unit Tests

- **Unit Tests** (recommended for debugging): Fast, isolated, uses mocks
- **Integration Tests**: Full system test, slower, requires database setup

### Debugging Tips

1. **Add more debug output** to see internal state:
   ```csharp
   System.Diagnostics.Debug.WriteLine($"[DEBUG] Variable: {variableName}");
   ```

2. **Use Assert statements** to validate assumptions:
   ```csharp
   registerRequest.Should().NotBeNull();
   ```

3. **Check mock verifications** to ensure correct method calls:
   ```csharp
   _mockUserManager.Verify(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Once);
   ```

## Ready to Debug!

The debugging setup is complete. Use VS Code's debug panel (`Ctrl+Shift+D`) and select the appropriate test configuration to start debugging your user creation tests!