 Coding Rules

## Naming Conventions
- Use PascalCase for class, interface, and method names.
- Use camelCase for local variables and method parameters.
- Suffix data access classes with `DataAccess`.
- Suffix service classes with `Service`.
- Use singular names for entity classes.

## Project Structure
- Keep controllers in the `Api` project under the `Controllers` folder.
- Place business logic in the `BLL` project.
- Place data access logic in the `DATA` project.

## Dependency Injection
- Register services and data access classes as `Scoped` in `Program.cs`.

## General Guidelines
- Write XML documentation for public classes and methods.
- Avoid magic strings and numbers; use constants or configuration.
- Prefer async methods for database and IO operations.
- Use explicit access modifiers.

## Comments
- Use summary comments for classes and methods.
- Use inline comments only when necessary for clarity.

## Error Handling
- Use try-catch blocks for external resource access.
- Log exceptions with context.