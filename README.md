<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Levantar proyecto en desarrollo

1. Clonar el repositorio
2. Instalar dependencias
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i-g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Levantar proyecto en modo desarrollo
```
yarn start:dev
```

## Stack en desarrollo
* MongoDB
* Mongoose
* Nest

## Si en caso se presenta problemas de version NODE

### Instalar y Actualizar Script
Para instalar o actualizar nvm, debe ejecutar el script de instalación. Para hacer eso, puede descargar y ejecutar el script manualmente, o usar el siguiente comando cURL o Wget:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
Si despues de instalar el script y obtiene problemas del *nvm*. Alternativamente, puede ejecutar los siguientes comandos para los diferentes shells en la línea de comandos
```
yarn start:dev
```
bash: source `~/.bashrc`

zsh: source `~/.zshrc`

ksh: `. ~/.profile`

con eso estarias teniendo el versionamiento de node, entonces ir al proyecto y ejecutar:

```
nvm use
```