function perform<Action>(data):
    try:
        # Validate inputs
        if not validate(data):
            return { status: "error", message: "Invalid input", retryable: false }

        # External call (Firebase, API, etc.)
        response = ExternalSystem.call<Action>(data)

        # Map response
        if response.code == 200:
            return { status: "success", data: response.data }
        elif response.code in [500, 503]:
            return { status: "error", message: "Server busy", retryable: true }
        else:
            return { status: "error", message: response.message, retryable: false }

    catch (networkError):
        logError("Network failure in Service.<Action>", networkError)
        return { status: "error", message: "Network unavailable", retryable: true }

    catch (unexpectedError):
        logError("Service.<Action> failed", unexpectedError)
        return { status: "error", message: "Unexpected service failure", retryable: false }
 