//cube
const cubes = {
    cube01: {
        x: 100,
        y: 250,
        weight:'140g',
        water_height:80,
    },
    cube02: {
        x: 300,
        y: 250,
        weight:'240g',
        water_height:60,
    },
    cube03: {
        x: 300,
        y: 520,
        weight:'980g',
        water_height:40,
    },
    cube04: {
        x: 100,
        y: 520,
        weight:'100g',
        water_height:20,
    }
}

//platform
const platform = {
    //物體平台
    platform1: {
        x: 210,
        y: 400
    },
    //物體平台
    platform2: {
        x: 210,
        y: 650
    },
    //秤重平台
    platform3: {
        x: 1300,
        y: 400
    },
}

//watebox
const waterBox = {
    //容器左邊
    left: {
        x: 500,
        y: 650
    },
    right: {
        x: 900,
        y: 650
    },
    bottom: {
        x: 700,
        y: 690
    }

}

//ruler
const ruler = {
    x: 955,
    y: 590,
}

//ruler detail
const rulerDetail = {
    x: 955,
    y: 590,
    scale: 1.1
}

//button
const btnReset = {
    x: 700,
    y: 250
}

//weigh
const weigh = {
    x: 1200,
    y: 245
}

const txtKG = {

    x: 1165,
    y: 325,
    defaultText: '0g',
    fontSize: '52px'

}

const txtOpTips = {
    x: 470,
    y: 150,
    defaultText: '',
    fontSize: '52px'
}

const txtCubeInfo = {
    x: 0,
    y: 0,
    defaultText: '',
    fontSize: '32px'
}


const water = {
    x:700,
    y:800,
    width:370,
    height:500,
    color:0xd4f1f9
}
const water_ruler = {
    x:955,
    y:water.y,
    width:65,
    height:water.height,
    color:water.color
}

export const TabletConfig = {
    cubes,
    platform,
    waterBox,
    ruler,
    rulerDetail,
    btnReset,
    weigh,
    txtKG,
    txtOpTips,
    txtCubeInfo,
    water,
    water_ruler,
}