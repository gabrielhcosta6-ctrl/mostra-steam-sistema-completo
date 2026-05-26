document.addEventListener("DOMContentLoaded", () => {

const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

const ease = "cubic-bezier(0.25, 0.8, 0.25, 1)"

function animateTitle(el){
if(!el) return
el.style.opacity = 0
el.style.transform = "translateY(15px)"
setTimeout(() => {
el.style.transition = `all .8s ${ease}`
el.style.opacity = 1
el.style.transform = "translateY(0)"
}, 120)
}

function revealElements(){
const items = $$(".left, .right, .card, .update-item, .download-box, .login-box, .account-left")

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
entry.target.style.transition = "all .7s ease"
entry.target.style.opacity = 1
entry.target.style.transform = "translateY(0)"
}
})
}, { threshold: 0.15 })

items.forEach(el => {
el.style.opacity = 0
el.style.transform = "translateY(20px)"
observer.observe(el)
})
}

function initSlider(){
const slides = $("#slides")
if(!slides) return

let index = 0
const total = slides.children.length

setInterval(() => {
index = (index + 1) % total
slides.style.transition = `transform .8s ${ease}`
slides.style.transform = `translateX(-${index * 100}%)`
}, 4000)
}

function initUserMenu(){
const userIcon = $("#userIcon")
const userMenu = $("#userMenu")

if(!userIcon || !userMenu) return

userIcon.addEventListener("click", (e) => {
e.stopPropagation()
userMenu.classList.toggle("active")
})

document.addEventListener("click", (e) => {
if(!userMenu.contains(e.target)){
userMenu.classList.remove("active")
}
})
}

function initCursorGlow(){
const glow = document.createElement("div")

glow.style.position = "fixed"
glow.style.width = "160px"
glow.style.height = "160px"
glow.style.borderRadius = "50%"
glow.style.pointerEvents = "none"
glow.style.zIndex = "0"
glow.style.background = "radial-gradient(circle, rgba(0,184,240,.20), transparent 70%)"
glow.style.transform = "translate(-50%, -50%)"
glow.style.filter = "blur(10px)"

document.body.appendChild(glow)

let x = 0
let y = 0
let mx = 0
let my = 0

window.addEventListener("mousemove", (e) => {
mx = e.clientX
my = e.clientY
})

function animate(){
x += (mx - x) * 0.12
y += (my - y) * 0.12

glow.style.left = x + "px"
glow.style.top = y + "px"

requestAnimationFrame(animate)
}

animate()
}

function initAuthButtons(){

const btnLogin = document.getElementById("btnLogin")
const btnCadastro = document.getElementById("btnCadastro")

if(btnLogin){
btnLogin.addEventListener("click", async () => {

const email = document.getElementById("loginEmail")?.value
const senha = document.getElementById("loginSenha")?.value

const res = await fetch("http://localhost:3000/login", {
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({email, senha})
})

const data = await res.json()

if(res.ok){
localStorage.setItem("session", JSON.stringify(data.user))
window.location.href = "index.html"
}else{
alert(data.message)
}

})
}

if(btnCadastro){
btnCadastro.addEventListener("click", async () => {

const nome = document.getElementById("nome")?.value
const email = document.getElementById("email")?.value
const senha = document.getElementById("senha")?.value

const res = await fetch("http://localhost:3000/register", {
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({nome, email, senha})
})

const data = await res.json()

if(res.ok){
alert("Cadastro realizado")
window.location.href = "login.html"
}else{
alert(data.message)
}

})
}
}

function loadSession(){
const session = JSON.parse(localStorage.getItem("session"))
const dashUser = document.getElementById("dashUser")

if(session && dashUser){
dashUser.innerText = session.nome
}
}

function init(){
$$(".left h1, .tag, .download-box h1, .account-left h1").forEach(animateTitle)

revealElements()
initSlider()
initUserMenu()
initCursorGlow()
initAuthButtons()
loadSession()
}

init()

})