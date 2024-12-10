const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 允许跨域访问
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 根路径直接返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

// 加载 JSON 数据
const airportsData = require('./airportsData.json');
const routesData = require('./routesData.json');
const airportsData_i = require('./airportsData_international.json');
const routesData_i = require('./routesData_international.json');
const ExactAirports_2016= require('./2016_data.json');
const ExactAirports_2017= require('./2017_data.json');
const ExactAirports_2018= require('./2018_data.json');
const ExactAirports_2019= require('./2019_data.json');
const ExactAirports_2020= require('./2020_data.json');
const ExactAirports_2021= require('./2021_data.json');
const ExactAirports_2022= require('./2022_data.json');
//获取每个机场的吞吐量

app.get('/api/airport2016', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2016;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);
});
app.get('/api/airport2017', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2017;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);
});
app.get('/api/airport2018', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2018;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);
});
app.get('/api/airport2019', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2019;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);
});
app.get('/api/airport2020', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2020;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);
});
app.get('/api/airport2021', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2021;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);;
});
app.get('/api/airport2022', (req, res) => {
    const {
        name,
        passengerTraffic,
        cargoMailTraffic,
        takeOffLandings
    } = req.query;
    let matchingData=ExactAirports_2022;
    if (name) {
        matchingData = matchingData.filter(airport => 
            airport.name && airport.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(matchingData);
});

// 定义获取所有机场的 API
app.get('/api/airports', (req, res) => {
    res.json(airportsData);
});
app.get('/api/airports_i', (req, res) => {
    res.json(airportsData_i);
});

// 定义按机场获取航线的 API
app.get('/api/routes',  (req, res) => {
    const {
        longitude,
        latitude,
        originName,
        destinationName,
        flightNumber,
    } = req.query;

    let matchingRoutes = routesData;

    // 如果提供了经纬度，按经纬度筛选相关航线
    if (longitude && latitude) {
        matchingRoutes = matchingRoutes.filter(
            (route) =>
                route.origin &&
                route.destination && // 确保 origin 和 destination 存在
                ((route.origin[0] === parseFloat(longitude) &&
                    route.origin[1] === parseFloat(latitude)) ||
                    (route.destination[0] === parseFloat(longitude) &&
                        route.destination[1] === parseFloat(latitude)))
        );
    }

    // 根据出发地名称过滤
    if (originName) {
        // 找到对应的机场坐标
        const originAirport = airportsData.find(
            (airport) =>
                airport.name.trim().toLowerCase() ===
                originName.trim().toLowerCase()
        );
        if (!originAirport) {
            return res
                .status(400)
                .json({ error: `Invalid origin name: ${originName}` });
        }
        const [originLng, originLat] = originAirport.geometry.coordinates;
        matchingRoutes = matchingRoutes.filter(
            (route) =>
                route.origin[0] === originLng && route.origin[1] === originLat
        );
    }

    // 根据目的地名称过滤
    if (destinationName) {
        const destinationAirport = airportsData.find(
            (airport) =>
                airport.name.trim().toLowerCase() ===
                destinationName.trim().toLowerCase()
        );
        if (!destinationAirport) {
            return res
                .status(400)
                .json({ error: `Invalid destination name: ${destinationName}` });
        }
        const [destLng, destLat] = destinationAirport.geometry.coordinates;
        matchingRoutes = matchingRoutes.filter(
            (route) =>
                route.destination[0] === destLng &&
                route.destination[1] === destLat
        );
    }

    // 根据航班号过滤
    if (flightNumber) {
        const inputFlightNumber = flightNumber.trim().toUpperCase();
        matchingRoutes = matchingRoutes.filter((route) => {
            // 将航班号字符串分割成单个航班号数组
            const flightNumbers = route.flights.flatMap((flightStr) =>
                flightStr.split(',').map(f => f.trim().toUpperCase())
            );
            return flightNumbers.includes(inputFlightNumber);
        });
    }

    res.json(matchingRoutes);
});

app.get('/api/routes_i',  (req, res) => {
    const {
        longitude,
        latitude,
        originName,
        destinationName,
        flightNumber,
    } = req.query;

    let matchingRoutes = routesData_i;

    // 如果提供了经纬度，按经纬度筛选相关航线
    if (longitude && latitude) {
        matchingRoutes = matchingRoutes.filter(
            (route) =>
                route.origin &&
                route.destination && // 确保 origin 和 destination 存在
                ((route.origin[0] === parseFloat(longitude) &&
                    route.origin[1] === parseFloat(latitude)) ||
                    (route.destination[0] === parseFloat(longitude) &&
                        route.destination[1] === parseFloat(latitude)))
        );
    }

    // 根据出发地名称过滤
    if (originName) {
        // 找到对应的机场坐标
        const originAirport = airportsData_i.find(
            (airport) =>
                airport.name.trim().toLowerCase() ===
                originName.trim().toLowerCase()
        );
        if (!originAirport) {
            return res
                .status(400)
                .json({ error: `Invalid origin name: ${originName}` });
        }
        const [originLng, originLat] = originAirport.geometry.coordinates;
        matchingRoutes = matchingRoutes.filter(
            (route) =>
                route.origin[0] === originLng && route.origin[1] === originLat
        );
    }

    // 根据目的地名称过滤
    if (destinationName) {
        const destinationAirport = airportsData_i.find(
            (airport) =>
                airport.name.trim().toLowerCase() ===
                destinationName.trim().toLowerCase()
        );
        if (!destinationAirport) {
            return res
                .status(400)
                .json({ error: `Invalid destination name: ${destinationName}` });
        }
        const [destLng, destLat] = destinationAirport.geometry.coordinates;
        matchingRoutes = matchingRoutes.filter(
            (route) =>
                route.destination[0] === destLng &&
                route.destination[1] === destLat
        );
    }

    // 根据航班号过滤
    if (flightNumber) {
        const inputFlightNumber = flightNumber.trim().toUpperCase();
        matchingRoutes = matchingRoutes.filter((route) => {
            // 将航班号字符串分割成单个航班号数组
            const flightNumbers = route.flights.flatMap((flightStr) =>
                flightStr.split(',').map(f => f.trim().toUpperCase())
            );
            return flightNumbers.includes(inputFlightNumber);
        });
    }

    res.json(matchingRoutes);
});


// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
