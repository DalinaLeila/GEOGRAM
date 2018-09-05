const link = document.querySelector('.link-create')
const body = document.querySelector('body')
const btnLogin = document.querySelector('.btn-login')
const btnNewGame = document.querySelector('a.animate-link')

link.addEventListener('click', evt => {
    evt.preventDefault()
    body.classList.add('fade-out')

    setTimeout(() => {
        window.location = link.href
    }, 500)
})

btnNewGame.addEventListener('click', evt => {
    evt.preventDefault()
    body.classList.add('fade-out')

    setTimeout(() => {
        window.location = btnNewGame.href
    }, 500)
})

// btn.addEventListener('click', () => {
//     body.classList.add('fade-out')
// })
