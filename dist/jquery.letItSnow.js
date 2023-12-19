// noinspection DuplicatedCode

(function ($) {
    $.fn.letItSnow = function (options = {}) {
        if ($(this).length > 1) {
            return $(this).each(function (i, e) {
                return $(e).letItSnow(options);
            });
        }

        const DEFAULTS = {
            background: null,
            quantity: "smooth", // smooth, less, medium or much
            flake: {
                html: "&#x2022;", // Snow Entity
                minSize: 2, // Minimum Flake Size
                maxSize: 19, // Maximum Flake Size
            },
            colors: ["lightblue", "skyblue", "#DDDDDD", "#EEEEEE"], // Snowflake Colours
            speed: 0.75, // Falling Velocity
            refresh: 50,
        };

        const setup = $.extend(true, DEFAULTS, options || {});

        let timeoutMove = null;
        let timeoutResized = null;

        const container = $(this).css("position", "relative");
        if (setup.background)
            container.css({
                background: setup.background,
                backgroundSize: "cover",
            });

        let amount = 0;

        function getAmountOfSnowflakes() {
            let quantity;
            switch (setup.quantity) {
                case "smooth":
                    quantity = 40;
                    break;
                case "medium":
                    quantity = 5;
                    break;
                case "much":
                    quantity = 3;
                    break;
                default:
                    quantity = 10;
            }
            return document.body.clientWidth / quantity;
        }

        function randomise(range) {
            return Math.floor(range * Math.random());
        }

        function buildFlakes() {
            for (let i = 0; i <= amount; i++) {
                let rotate = randomise(360);
                $("<span>", {
                    "data-flake": i,
                    css: {
                        cursor: "default",
                        userSelect: "none",
                        position: "absolute",
                        top: "-" + setup.flake.maxSize,
                        transform: `rotate(${rotate}deg)`,
                    },
                    html: setup.flake.html,
                }).appendTo(container);
            }
        }

        function destroy() {
            if (timeoutMove !== null) {
                clearTimeout(timeoutMove);
            }
            if (timeoutResized !== null) {
                clearTimeout(timeoutResized);
            }
            container.find("[data-flake]").remove();
            container.removeData("initSnowflakes");
        }

        function getContainerSizes(){
            const containerWidth = container.width() - 15;
            const containerHeight = container.height() - 5;
            return {
                width: containerWidth,
                height: containerHeight
            }
        }

        function initSnow() {
            const snowSize = setup.flake.maxSize - setup.flake.minSize;
            const sizes = getContainerSizes();

            for (let i = 0; i <= amount; i++) {
                const flake = container.find(`[data-flake='${i}']`);
                const size = randomise(snowSize) + setup.flake.minSize;
                const posX = randomise(sizes.width - size);
                const posY = randomise(2 * sizes.height - sizes.width - 2 * size);

                let data = {
                    coords: 0,
                    size: size,
                    left: Math.random() * 15,
                    pos: 0.03 + Math.random() / 10,
                    sink: (setup.speed * size) / 5,
                    posX: posX,
                    posY: posY,
                };

                flake.data("setup", data);

                flake.css({
                    pointerEvents: "none",
                    fontFamily: "inherit",
                    fontSize: size + "px",
                    color: setup.colors[randomise(setup.colors.length)],
                    zIndex: size,
                    left: posX + "px",
                    top: posY + "px",
                });
            }

            moveSnow();
        }

        function moveSnow() {
            const sizes = getContainerSizes();
            for (let i = 0; i <= amount; i++) {
                const flake = container.find(`[data-flake='${i}']`);
                let data = flake.data("setup");
                data.coords += data.pos;
                data.posY += data.sink;


                let left = data.posX + data.left * Math.sin(data.coords);
                // let rotate = randomise(5);
                flake.css({
                    left: left + "px",
                    top: data.posY + "px",
                    // transform: 'rotate('+rotate+'deg)'
                });

                if (
                    data.posY >= sizes.height - 2 * data.size ||
                    left > sizes.width - 3 * data.left
                ) {
                    data.posX = randomise(sizes.width - data.size);
                    data.posY = 0;
                }

                flake.data("setup", data);
            }

            timeoutMove = setTimeout(moveSnow, setup.refresh);
        }

        function init() {
            if (!container.data("initSnowflakes")) {
                amount = getAmountOfSnowflakes();
                buildFlakes();
                initSnow();
                initEvents();
                container.data("initSnowflakes", true);
            }
            return container;
        }

        function resizedFinished() {
            if (container.length) {
                destroy();
                init();
            }
        }

        function initEvents() {
            window.onresize = function () {
                clearTimeout(timeoutResized);
                timeoutResized = setTimeout(resizedFinished, 100);
            };
        }

        return init();
    };
})(jQuery);