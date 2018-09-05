const link = document.querySelector('.link-create')
const body = document.querySelector('body')
const btnLogin = document.querySelector('.btn-login')

link.addEventListener('click', evt => {
    evt.preventDefault()
    body.classList.add('fade-out')

    setTimeout(() => {
        window.location = link.href
    }, 500)
})

btnLogin.addEventListener('click', evt => {
    evt.preventDefault()
    body.classList.add('fade-out')

    setTimeout(() => {
        window.location = btnLogin.href
    }, 500)
})
