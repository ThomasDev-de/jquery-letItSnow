![let it snow picture](demo/img/jquery_letItSnow.png)

# jquery-letItSnow

A small jQuery plugin to show your website with snowfall.  
This plugin was created on the idea
of [Tracy Good](https://stackoverflow.com/users/17213191/tracy-good)
([Source](https://codepen.io/onlintool24/pen/GRMOBVo)).

The number of flakes is determined by the window width. If the window is resized, the flakes are recalculated.
## options

```js
let options = {
    background: null, // The background of the container. This property is set as css background.
    quantity: "smooth", // How many flakes should be produced? Possible values: smooth, less, medium or much
    flake: {
        html: "&#x2022;", // Snow Entity
        minSize: 2, // Minimum Flake Size
        maxSize: 19, // Maximum Flake Size
    },
    colors: ["lightblue", "skyblue", "#DDDDDD", "#EEEEEE"], // Snowflake Colours
    speed: 0.75, // The speed of the falling flakes
    refresh: 50 // The time in milliseconds how the token should be calculated
}
```

### example

```js
$('body').letItSnow({
    background: "fixed no-repeat center bottom url('demo/img/winter-landscape.png')",
    quantity: 'slowly',
    flake: {
        html: '<i class="bi bi-snow3"></i>'
    }
});
```
