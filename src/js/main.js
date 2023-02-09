const orgs = [
  { name: 'backblaze', min: 7, storageRate: 0.005, transferRate: 0.01 },
  {
    name: 'bunny',
    max: 10,
    storageRate: { hdd: 0.01, ssd: 0.02 },
    transferRate: 0.01,
  },
  {
    name: 'scaleway',
    storageRate: { multi: 0.06, single: 0.03 },
    transferRate: 0.02,
    free: 75,
  },
  {
    name: 'vultr',
    min: 5,
    storageRate: 0.01,
    transferRate: 0.01,
  },
]

const barColors = {
  grey: '#8C92AC',
  red: '#ff3333',
  orange: '#fc7f29',
  purple: '#c06a90',
  blue: '#1ac6ff',
}

const storageInput = document.querySelector("input[name='storage']")
const transferInput = document.querySelector("input[name='transfer']")

const rateValue = document.querySelector('.rate-value')
const transferValue = document.querySelector('.transfer-value')

// total values:
const backblazeValue = document.querySelector('.backblaze-value')
const bunnyValue = document.querySelector('.bunny-value')
const scalewayValue = document.querySelector('.scaleway-value')
const vultrValue = document.querySelector('.vultr-value')
// inputs for bunny.net:
const hdd = document.querySelector("input[value='hdd']")
const ssd = document.querySelector("input[value='ssd']")
// inputs for scaleway.net:
const multi = document.querySelector("input[value='multi']")
const single = document.querySelector("input[value='single']")
// diagram bars:
const backblazeBar = document.querySelector('.diagram-bars-backblaze')
const bunnyBar = document.querySelector('.diagram-bars-bunny')
const scalewayBar = document.querySelector('.diagram-bars-scaleway')
const vultrBar = document.querySelector('.diagram-bars-vultr')
const currency = document.querySelectorAll('.currency')
const barsWrapper = document.querySelectorAll('.diagram-bars-wrapper')
const diagram = document.querySelectorAll('.diagram-bars')

// result of inputs
let diskType = 'hdd'
let quantityType = 'multi'
let storage = '0'
let transfer = '0'

// orgs total data
let backblazeStorage = 0
let backblazeTransfer = 0
let bunnyStorage = 0
let bunnyTransfer = 0
let scalewayStorage = 0
let scalewayTransfer = 0
let vultrStorage = 0
let vultrTransfer = 0

const colorSwither = () => {
  backblazeBar.style.width = backblazeValue.innerHTML + '%'
  backblazeBar.style.backgroundColor = barColors.red
  bunnyBar.style.width = bunnyValue.innerHTML + '%'
  bunnyBar.style.backgroundColor = barColors.orange
  scalewayBar.style.width = scalewayValue.innerHTML + '%'
  scalewayBar.style.backgroundColor = barColors.purple
  vultrBar.style.width = vultrValue.innerHTML + '%'
  vultrBar.style.backgroundColor = barColors.blue

  const blackblazer = +backblazeBar.style.width.slice(0, -1)
  const bunny = +bunnyBar.style.width.slice(0, -1)
  const scaleway = +scalewayBar.style.width.slice(0, -1)
  const vultr = +vultrBar.style.width.slice(0, -1)
  const minimalPrice = Math.min(blackblazer, bunny, scaleway, vultr)

  if (blackblazer !== minimalPrice) {
    backblazeBar.style.backgroundColor = barColors.grey
  }
  if (bunny !== minimalPrice) {
    bunnyBar.style.backgroundColor = barColors.grey
  }
  if (scaleway !== minimalPrice) {
    scalewayBar.style.backgroundColor = barColors.grey
  }
  if (vultr !== minimalPrice) {
    vultrBar.style.backgroundColor = barColors.grey
  }
}

const setBarsVisibility = (element, action) => {
  if (action === 'show') {
    element.forEach((el) => el.classList.add('visible'))
  }
  if (action === 'hide') {
    element.forEach((el) => el.classList.remove('visible'))
  }
}

// handler  (hdd or ssd)
const diskHandler = (type, orgName) => (event) => {
  diskType = event.target.value
  orgs.map((item) => {
    if (item.name === orgName && type === 'hdd') {
      bunnyStorage = storage * item.storageRate.hdd
    }
    if (item.name === orgName && type === 'ssd') {
      bunnyStorage = storage * item.storageRate.ssd
    }
  })
  bunnyStorage + bunnyTransfer > 10
    ? (bunnyValue.textContent = 10)
    : (bunnyValue.textContent = bunnyStorage + bunnyTransfer)

  colorSwither()
}

// handler (multi or single)
const rateTypeHandler = (type, orgName) => (event) => {
  quantityType = event.target.value
  orgs
    .filter((org) => org.name === orgName)
    .map((org) => {
      if (type === 'multi' && +storage < org.free) {
        scalewayStorage = 0
      }
      if (type === 'multi' && +storage >= org.free) {
        scalewayStorage = (+storage - org.free) * org.storageRate.multi
      }
      if (type === 'single' && +storage < org.free) {
        scalewayStorage = 0
      }
      if (type === 'single' && +storage >= org.free) {
        scalewayStorage = (+storage - org.free) * org.storageRate.single
      }
    })
  scalewayValue.textContent = scalewayStorage + scalewayTransfer
  colorSwither()
}

hdd.addEventListener('change', diskHandler('hdd', 'bunny'))
ssd.addEventListener('change', diskHandler('ssd', 'bunny'))
multi.addEventListener('change', rateTypeHandler('multi', 'scaleway'))
single.addEventListener('change', rateTypeHandler('single', 'scaleway'))

storageInput.addEventListener('input', (e) => {
  storage = e.target.value

  setBarsVisibility(diagram, 'show')
  rateValue.textContent = storage
  // backblaze
  backblazeStorage = storage * 0.005
  backblazeStorage + backblazeTransfer < 7
    ? (backblazeValue.textContent = 7)
    : (backblazeValue.textContent = (
        Number(backblazeStorage) + Number(backblazeTransfer)
      ).toFixed(2))

  // bunnyStorage = storage * 0.01
  if (diskType === 'hdd') {
    bunnyStorage = storage * 0.01
  }
  if (diskType === 'ssd') {
    bunnyStorage = storage * 0.02
  }

  bunnyStorage + bunnyTransfer > 10
    ? (bunnyValue.textContent = 10)
    : (bunnyValue.textContent = (
        Number(bunnyStorage) + Number(bunnyTransfer)
      ).toFixed(2))

  // scaleway
  if (quantityType === 'multi') {
    if (storage < 75) {
      scalewayStorage = 0
    } else {
      scalewayStorage = (storage - 75) * 0.06
    }
  }
  if (quantityType === 'single') {
    if (storage < 75) {
      scalewayStorage = 0
    } else {
      scalewayStorage = (storage - 75) * 0.03
    }
  }
  scalewayValue.textContent = (
    Number(scalewayStorage) + Number(scalewayTransfer)
  ).toFixed(2)

  // vultr
  vultrStorage = storage * 0.01

  vultrStorage + vultrTransfer < 5
    ? (vultrValue.textContent = 5)
    : (vultrValue.textContent = (
        Number(vultrStorage) + Number(vultrTransfer)
      ).toFixed(2))

  colorSwither()

  if (storage === '0' && transfer === '0') {
    console.log('both zero')
    setBarsVisibility(diagram, 'hide')
  }
})

transferInput.addEventListener('input', (e) => {
  transfer = e.target.value
  setBarsVisibility(diagram, 'show')
  transferValue.textContent = transfer
  // backblaze
  backblazeTransfer = transfer * 0.01
  backblazeStorage + backblazeTransfer < 7
    ? (backblazeValue.textContent = 7)
    : (backblazeValue.textContent = (
        Number(backblazeStorage) + Number(backblazeTransfer)
      ).toFixed(2))
  // bunny
  bunnyTransfer = transfer * 0.01
  bunnyStorage + bunnyTransfer > 10
    ? (bunnyValue.textContent = 10)
    : (bunnyValue.textContent = (
        Number(bunnyStorage) + Number(bunnyTransfer)
      ).toFixed(2))
  // scaleway
  if (transfer < 75) {
    scalewayTransfer = 0
  } else {
    scalewayTransfer = (transfer - 75) * 0.02
  }
  scalewayValue.textContent = (
    Number(scalewayStorage) + Number(scalewayTransfer)
  ).toFixed(2)

  // vultr
  vultrTransfer = transfer * 0.01

  vultrStorage + vultrTransfer < 5
    ? (vultrValue.textContent = 5)
    : (vultrValue.textContent = (
        Number(vultrStorage) + Number(vultrTransfer)
      ).toFixed(2))

  colorSwither()
  if (transfer === '0' && storage === '0') {
    setBarsVisibility(diagram, 'hide')
  }
})
