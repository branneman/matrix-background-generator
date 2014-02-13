(function() {

    // Settings
    var settings = {
        fps: 9,
        loopLength: 10,
        sqSize: 15,
        width: window.innerWidth,
        height: window.innerHeight
    };
    var chr = 'abcdefghijklmnopqrstuvwxyzABCDEFQRSXYZ0123456789!"#$%&\'()*+,-./:;<=>?[\\]^_{|}~-\u00AD';

    // Cache DOM queries
    var cnvs = document.getElementById('the-matrix');
    var mtrx = cnvs.getContext('2d');

    // Set canvas size
    cnvs.setAttribute('width', settings.width);
    cnvs.setAttribute('height', settings.height);

    // Cache
    var squaresHorizontal = Math.floor(cnvs.width / settings.sqSize);
    var squaresVertical   = Math.floor(cnvs.height / settings.sqSize);
    var animLength        = squaresVertical * 10;
    var pxOffsetX         = Math.floor((cnvs.width - settings.sqSize * squaresHorizontal) / 2);
    var pxOffsetY         = Math.floor((cnvs.height - settings.sqSize * squaresVertical) / 2);

    // Frame loop timings
    var code  = generateAnimation();
    var time  = 1000 * settings.loopLength;
    var start = Date.now();

    // Reload page on window resize
    window.addEventListener('resize', function() {
        window.location.reload();
    });

    // Start animation
    setInterval(tick, 1000 / settings.fps);

    //
    // Generate animation
    //
    function generateAnimation() {

        var code = [];
        for (var x = 0; x < squaresHorizontal; x++) {

            var line = [];
            var paintLine = true;

            var randomRange = (Math.random() < .05 ? 70 : 25); // 5% chance on a very long line

            while (line.length < animLength) {

                var lineLength = 5 + Math.floor(Math.random() * randomRange);

                for (var i = 0; i < lineLength; i++) {

                    if (paintLine) {
                        line.push({
                            char: chr[Math.floor(Math.random() * chr.length)],
                            opacity: ((i === lineLength - 1) ? 1 : .3 + (i / lineLength))
                        });
                    } else {
                        line.push(false);
                    }
                }

                paintLine = !paintLine;
            }

            line = line.slice(0, animLength);
            code.push(line);
        }

        return code;
    }

    //
    // Frame ticks
    //
    function tick() {

        // Frame timing
        var now = Date.now();
        if (now >= (start + time)) {
            start = Date.now();
        }
        var frame = (now - start) / time;

        // Draw frame
        clearCanvas();
        drawFrame(frame);
    }

    //
    // Clears the canvas
    //
    function clearCanvas() {

        // Clear canvas
        mtrx.clearRect(0, 0, cnvs.width, cnvs.height);

        // Paint it black
        mtrx.fillStyle = 'black';
        mtrx.fillRect(0, 0, 500, 500);

        // Set text styles
        mtrx.font = '18px Matrix';
    }

    //
    // Called every frame
    //
    function drawFrame(frame) {

        var offsetY = Math.round((animLength - squaresVertical) * frame);

        for (var x = 0; x < squaresHorizontal; x++) {

            for (var y = 0; y < squaresVertical; y++) {

                var point = code[x][animLength - squaresVertical - offsetY + y];
                if (point) {

                    // Set color & opacity
                    if (point.opacity === 1) {
                        mtrx.fillStyle = 'rgb(150, 204, 150)';
                    } else {
                        mtrx.fillStyle = 'rgba(0, 204, 0, ' + point.opacity + ')'; // rgb(0,204,0) = #0c0
                    }

                    // 25% chance of generating random different character
                    var char = point.char;
                    if (Math.random() < .25) {
                        char = chr[Math.floor(Math.random() * chr.length)];
                    }

                    // Draw character
                    var posX = x * settings.sqSize + pxOffsetX;
                    var posY = y * settings.sqSize + settings.sqSize + pxOffsetY;
                    mtrx.fillText(char, posX, posY);
                }
            }
        }
    }

}());