# Step-by-Step Debugging Guide

## 🔍 How to Step Through User Creation Test with Debugger

### Method 1: VS Code Integrated Debugger (Easiest)

#### Step 1: Set Breakpoints
1. Open `AuthControllerUnitTests.cs`
2. Click in the **left margin (gutter)** next to these lines to set red dots (breakpoints):
   - Line ~81: `System.Diagnostics.Debugger.Break();`
   - Line ~84: `var result = await _controller.Register(registerRequest);`
   - Line ~87: `System.Diagnostics.Debug.WriteLine($"[DEBUG] Registration result type: {result.GetType().Name}");`

#### Step 2: Start Debug Session
1. Press `Ctrl+Shift+D` to open Debug panel
2. Select **"Debug Unit Test - Register Valid Nurse User"** from dropdown
3. Press `F5` or click green "Start Debugging" button

#### Step 3: Debug Controls
When debugger stops at breakpoint, use these keys:
- **F10** (Step Over) - Execute current line, don't go into method details
- **F11** (Step Into) - Go inside method calls to see implementation
- **Shift+F11** (Step Out) - Exit current method back to caller
- **F5** (Continue) - Continue to next breakpoint
- **Shift+F5** (Stop) - Stop debugging session

#### Step 4: Inspect Variables
- **Variables Panel** (left side): See all local variables and their values
- **Watch Panel**: Add expressions like `registerRequest.Email` to monitor
- **Call Stack**: See the path of method calls
- **Debug Console**: Type expressions to evaluate them

### Method 2: Manual Debugger Attachment

1. **Start test with debugger wait**:
   ```bash
   dotnet test INF.CommApp.Tests --filter "Register_ValidNurseUser_ReturnsOkResult" --configuration Debug
   ```

2. **Attach debugger**:
   - Press `Ctrl+Shift+P`
   - Type "Debug: Attach to Process"
   - Select the dotnet test process

### Method 3: Using Console Debugging

If visual debugger doesn't work, add more console output:

```csharp
Console.WriteLine($"Request: {JsonSerializer.Serialize(registerRequest)}");
Console.WriteLine($"Mock setup complete");
// ... after Register call ...
Console.WriteLine($"Result type: {result.GetType()}");
```

## 🎯 What You Can Debug

### 1. Input Validation
- Examine `registerRequest` object
- Check all properties are set correctly
- Verify password meets requirements

### 2. Mock Behavior
- See how mocks are configured
- Verify mock methods are called
- Check return values from mocks

### 3. Controller Logic
- Step into `_controller.Register()` method
- See how user object is created
- Watch role assignment logic

### 4. Result Verification
- Examine the returned result object
- Check HTTP status codes
- Verify response content

## 🔧 Debugging Tips

1. **Use the Watch Panel**: Add these expressions to monitor:
   - `registerRequest`
   - `result`
   - `_mockUserManager.Object`

2. **Check Call Stack**: See the full execution path

3. **Examine Exception Details**: If test fails, debugger shows exact exception

4. **Step Through Assertions**: See which assertions pass/fail

## 🚨 Troubleshooting

If debugger doesn't start:
1. Ensure you're in Debug configuration
2. Build the project first: `Ctrl+Shift+P` → "Tasks: Run Build Task"
3. Check that breakpoints are on executable lines (not comments/whitespace)

## Ready to Debug!

Your test is now set up with automatic debugger breaks and manual breakpoint locations. Just press `F5` in the Debug panel to start stepping through your user creation test!