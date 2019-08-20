ctx.fillText(city.name, city.coords[0] - 25, city.coords[1] - 15)

// Disease Cubes
ctx.beginPath()
ctx.rect(city.coords[0] - 20, city.coords[1] + 15, 10, 10)
ctx.fillStyle = 'blue'
ctx.fill()

ctx.beginPath()
ctx.rect(city.coords[0] - 10, city.coords[1] + 15, 10, 10)
ctx.fillStyle = 'yellow'
ctx.fill()

ctx.beginPath()
ctx.rect(city.coords[0], city.coords[1] + 15, 10, 10)
ctx.fillStyle = 'black'
ctx.fill()

ctx.beginPath()
ctx.rect(city.coords[0] + 10, city.coords[1] + 15, 10, 10)
ctx.fillStyle = 'red'
ctx.fill()

// Disease Cube Numbers
ctx.beginPath()
ctx.fillStyle = 'white'
ctx.fillText(city.blue, city.coords[0] - 18, city.coords[1] + 23)

ctx.beginPath()
ctx.fillStyle = 'black'
ctx.fillText(city.yellow, city.coords[0] - 8, city.coords[1] + 23)

ctx.beginPath()
ctx.fillStyle = 'white'
ctx.fillText(city.black, city.coords[0] + 3, city.coords[1] + 23)

ctx.beginPath()
ctx.fillStyle = 'black'
ctx.fillText(city.red, city.coords[0] + 13, city.coords[1] + 23)
