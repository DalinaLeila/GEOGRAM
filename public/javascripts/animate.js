const btnLogin = document.querySelector('button')
const body = document.querySelector('body')
const btnNewGame = document.querySelector('.btn-newGame')

btnLogin.addEventListener('click', () => {
    body.classList.add('fade-out')
})

// btnNewGame.addEventListener('click', () => {
//     alert('btn clicked')
//     btnNewGame.classList.add('fade-out')
// })
