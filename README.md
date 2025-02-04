# Rectangle Editor Application

A responsive SVG rectangle editor with real-time perimeter calculation and backend validation.

## Features

- Initial dimensions loaded from JSON
- Mouse-driven resizing with visual handle
- Real-time perimeter display
- Backend validation (10s simulated delay)
- Concurrent request handling
- Error state management

## Setup

### Backend (.NET 6)

```bash
cd RectangleApi
dotnet restore
dotnet run
```

- Create Data/dimensions.json with initial dimensions:
```json
{"Width":200,"Height":150}
```

### Frontend (React)

```bash
cd rectangle-ui
npm install
npm start
```
## Key Implementation

### Backend:

 ✔️ SemaphoreSlim for request sequencing

 ✔️ File-based persistence with locking

 ✔️ Async validation 

### Frontend:

✔️ Debounced API requests (500ms)

✔️ Request cancellation with AbortController

✔️ State version tracking

## Testing

 - Drag bottom-right handle to resize
 - Observe perimeter updates
 - Wait 10s after release for validation:
 - Green: Successful save
 - Red: Width > Height error
 - Continue resizing during validation
