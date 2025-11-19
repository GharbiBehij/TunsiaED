function handle<Action>(inputData):
    setState("loading")

    try:
        # Call the backend or service
        response = Service.perform<Action>(inputData)

        # Retry once if its a transient error
        if response.status == "error" and response.retryable == true:
            response = Service.perform<Action>(inputData)

        # Handle final outcome
        if response.status == "success":
            setState("success", data = response.data)
        else:
            setState("error", message = response.message)

    catch (exception):
        logError("ViewModel.<Action> failed", exception)
        setState("error", message = "Unexpected failure occurred")
