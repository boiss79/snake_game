

window.onload = function()
{   
    let canvasWidth = 900;                         // Déclaration des variables globales
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let xCoord = 0;
    let yCoord = 0;
    var apple;
    let snake;
    let widthInBlocks = canvasWidth/blockSize;
    let heightInBlock = canvasHeight/blockSize;
    let score;
    let timeOut;
    init();
    function init(){
        let canvas = document.createElement('canvas'); // On créer un element dans le document, le contenu de notre html, cet élément est un canvas.
        canvas.width = canvasWidth;                // On lui donne une largeur avec la methode width
        canvas.height = canvasHeight;              // On lui donne une hauteur avec la methode height 
        canvas.style.border = "30px solid grey";   // On lui defini une bordure
        document.body.appendChild(canvas);         // Ajout du canvas dans le body
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        ctx = canvas.getContext('2d');             // On recupère le contexte de notre canvas
        snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]], "right") 
        apple = new Apple([10,10]);
        score = 0;    
        refreshCanvas();                           // Appelle de la fonction refresh 
    

    }
    function refreshCanvas(){
        
        snake.advance();

        if(snake.checkCollision()){

            gameOver();
        }
        else{
            if(snake.isEatinApple(apple)){
                snake.eatApple = true;
                score ++;
                do{
                    apple.setNewPosition();
                }
                while(apple.isOnSnake(snake));
            }
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            drowScore();
            snake.draw();  
            apple.draw();           
            timeOut = setTimeout(refreshCanvas, delay);
        }
                         // On appelle la fonction refresh au bout d'un certain nombre de ms
        
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let centreX = canvasWidth/2;
        let centerY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centerY - 180);
        ctx.fillText("Game Over", centreX, centerY - 180);

        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Game Over", centreX, centerY -120);


        ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centerY - 120);

        ctx.restore();
    }

    function restart(){
        snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]], "right") 
        apple = new Apple([10,10]);    
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drowScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        let centreX = canvasWidth/2;
        let centerY = canvasHeight/2;

        ctx.fillText(score.toString(), centreX, centerY);

        ctx.restore();
    }

    function drawBlock(ctx, position){
        let x = position[0] * blockSize;                // Fonction qui créer des "blocks" pour le snake
        let y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize, blockSize);         // Création des rectanges = "blocks"
    }

    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "red";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function(){
            let nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid direction");
            }
            this.body.unshift(nextPosition);   //Ajout de la nouvelle position dans le tableau body
            if(!this.eatApple){
                this.body.pop(); // Supression de la dernière position dans le tableau
            }
            else{
                this.eatApple = false;
            }
                                   
        } 
        this.setDirection= function(newDirection){
            let allowedDirection;
            switch(this.direction){
                case "left":
                    allowedDirection = ["up","down"];
                break;
            case "right":
                allowedDirection = ["up","down"];
                break;
            case "down":
                allowedDirection = ["left","right"];
                break;
            case "up":
                allowedDirection = ["left","right"];
                break; 
            default:
                throw("Invalid direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        }
        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeHeadX = head[0];
            let snakeHeadY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks -1;
            let maxY = heightInBlock -1;
            let isNotBetweenHorizontalWalls = snakeHeadX < minX || snakeHeadX > maxX;
            let isNotBetweenVerticalWalls = snakeHeadY < minY || snakeHeadY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }

            for(let i =0; i < rest.length; i++){
                if(snakeHeadX == rest[i][0] && snakeHeadY == rest[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        };
        this.isEatinApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] == appleToEat.position[0] && head[1] == appleToEat.position[1])
               return true;
            else
                return false;
        }
    }

    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="#33cc33";
            ctx.beginPath();
            let radius = blockSize/2;
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            let newX = Math.round(Math.random() * (widthInBlocks -1));
            let newY = Math.round(Math.random() * (heightInBlock -1));
            this.position = [newX,newY];
        };
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;

            for(let i =0; i< snakeToCheck.body.length; i++){
                if(this.position[0] == snakeToCheck.body[i][0] && this.position[1] == snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            };
            return isOnSnake;
        };

    }

    document.onkeydown = function handleKeyDown(e){
        let key = e.keyCode;
        let newDirection;
        switch (key){
            case 37:        //Touche flèche gauche
                newDirection = "left";
                break;
            case 38:        //Touche flèche du haut
                newDirection = "up";
                break;
            case 39:        // Touche flèche droite
                newDirection = "right";
                break;
            case 40:        // Touche flèche en bas
                newDirection = "down";
                break;
            case 32:        // Touche espace
                restart();
                score = 0;
                break;
            default:
                return;
        }
        snake.setDirection(newDirection);
    }
}



