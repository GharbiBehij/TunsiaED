# USER EVENT
on<Action>ButtonClick(inputData):
    ViewModel.handle<Action>(inputData)

# STATE REACTION
observe ViewModel.state:
    if state == "loading":
        showLoadingIndicator()
    elif state == "success":
        updateUIWith(state.data)
    elif state == "error":
        showError(state.message)

onLoginButtonClick(email,password):
   viewmodel.Login(email,password)
observe viewmodel.state:
  if state=="loading":
      showLoadingIndicator()
   elif state =="success":
      UpdateUIwith(state.data)
   elif state=="error":
   showError(state.message)   