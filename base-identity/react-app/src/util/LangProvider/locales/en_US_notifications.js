export const Messaging = {
    success,
    error
};

let good = [
    "Success",
    "Good Job",
    "Excellent",
    "Way to go!",
    "Nice!",
    "That'll do!",    
    "That worked!",
    "Bueno",
    "Ok",
    "Bingo"
];

let bad = [    
    "Bummer",
    "Something didn't work",
    "Error",
    "Nope",
    "Shucks"
];

function success() {
    return good[Math.floor(Math.random() * good.length)];
}

function error() {
    return bad[Math.floor(Math.random() * bad.length)];
}