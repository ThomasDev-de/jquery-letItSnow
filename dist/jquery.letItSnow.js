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
                minSize: 1, // Minimum Flake Size
                maxSize: 7, // Maximum Flake Size
            },
            colors: ["#DDDDDD", "#EEEEEE"], // Snowflake Colours
            speed: 0.75, // Falling Velocity
            refresh: 50,
        };

        const container = $(this).css("position", "relative");
        const setup = $.extend(true, DEFAULTS, options || {});

        let timeoutMove = null;
        let initObserver = false;

        // If the parent element changes size, reinitialize the plugin
        let observer = new ResizeObserver(() => {
            if (initObserver) {
                resizedFinished();
            }
            initObserver = true;
        });

        if (setup.background)
            container.css({
                background: setup.background,
                backgroundSize: "cover",
            });

        let amount = 0;

        function getAmountOfSnowflakes() {
            let quantity;
            switch (setup.quantity) {
                case "less":
                    quantity = 10;
                    break;
                case "medium":
                    quantity = 5;
                    break;
                case "much":
                    quantity = 3;
                    break;
                default:
                    quantity = 40;
            }
            return document.body.clientWidth / quantity;
        }

        function randomise(range) {
            return Math.floor(range * Math.random());
        }

        function buildFlakes() {
            const dataContainer = container.data("containerSnowId");
            for (let i = 0; i <= amount; i++) {
                let rotate = randomise(360);
                $("<span>", {
                    "data-container-id": dataContainer,
                    "data-flake": i,
                    css: {
                        opacity: 0,
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
            const dataContainer = container.data("containerSnowId");

            container.find(`[data-flake][data-container-id="${dataContainer}"]`).remove();
            container.removeData("initSnowflakes");
        }

        function getContainerSizes() {
            const containerWidth = container.outerWidth() - 15;
            const containerHeight = container.outerHeight() - 5;
            return {
                width: containerWidth,
                height: containerHeight
            }
        }

        function initSnow() {
            const snowSize = setup.flake.maxSize - setup.flake.minSize;
            const sizes = getContainerSizes();
            const dataContainer = container.data("containerSnowId");

            for (let i = 0; i <= amount; i++) {
                const flake = container.find(`[data-flake='${i}'][data-container-id="${dataContainer}"]`);
                const size = randomise(snowSize) + setup.flake.minSize;
                const posX = randomise(sizes.width - size);
                const posY = randomise(sizes.height - size);

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

            container.find(`[data-flake][data-container-id="${dataContainer}"]`).animate({opacity: 1}, 2000);


            moveSnow();
        }

        function moveSnow() {
            const sizes = getContainerSizes();
            const dataContainer = container.data("containerSnowId");

            for (let i = 0; i <= amount; i++) {
                const flake = container.find(`[data-flake='${i}'][data-container-id="${dataContainer}"]`);
                const data = flake.data("setup");
                data.coords += data.pos;
                data.posY += data.sink;

                let left = data.posX + data.left * Math.sin(data.coords);

                flake.css({
                    left: left + "px",
                    top: data.posY + "px"
                });

                const touchesTheGround = (data.posY + data.size) >= sizes.height;
                if (touchesTheGround) {
                    data.posX = randomise(sizes.width - data.size);
                    data.posY = 0;
                }

                flake.data("setup", data);
            }

            timeoutMove = setTimeout(moveSnow, setup.refresh);
        }

        function generateGUID() {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let guid = '';
            // Ensure the first character is a letter
            guid += chars.charAt(Math.floor(Math.random() * 52)); // 0-51 for letters only
            // Generate the rest of the GUID (e.g., 15 more characters for a total of 16)
            for (let i = 1; i < 16; i++) {
                guid += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return guid;
        }

        function init() {
            if (!container.data("initSnowflakes")) {
                container.data("containerSnowId", "snow_container_" + generateGUID());
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
            observer.observe(container.get(0))
        }

        return init();
    };
})(jQuery);
