class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        const keys = this.engine.keys;
        if (key === 'Captains Quarters'){
            
            if (!keys.skeleton || !keys.sail || !keys.food){
                this.engine.show('The door to the captains quarters has three locks, it looks like you need to find all three of them to enter.');
                this.engine.addChoice("Head back", { Text: "Head back", Target: "Main Deck" });
                return;
            }
        }
        
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                if (key === 'Brig' && choice.Text === 'Approach skeleton' && this.engine.skeletonPuzzle.solved) continue;
                if (key === 'Mast' && choice.Text === 'Raise the sail' && keys.sail) continue;
                if (key === 'Cave wall' && choice.Text === 'Raise the sail' && keys.sail) continue;
                let choiceObj = {
                    Text: choice.Text,
                    Target: choice.Target || key,
                    Action: choice.Action
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);

            if (choice.Target === 'Skeleton' && choice.Action){
                let puzzle = this.engine.skeletonPuzzle;
            
                puzzle.sequence.push(choice.Action);
                if (puzzle.sequence.length === puzzle.solution.length){
                    const current = puzzle.sequence;
                    const correct = puzzle.solution;

                    let solution = true;
                    for (let i = 0; i < current.length; i++){
                        if (current[i] !== correct[i]){
                            solution = false;
                            break;
                        }
                    }

                    if (solution){
                        this.engine.show("The skeleton's jaw drops, and a key falls out");
                        puzzle.solved = true;
                        this.engine.keys.skeleton = true;
                        this.engine.storyData.Locations["Skeleton"].Choices.unshift({
                            Text: "Take the key",
                            Target: "Brig"
                        });
                    } else {
                        this.engine.show("Nothing happened...");
                    }
                    puzzle.sequence = [];
                    
                    
                    this.engine.gotoScene(Location, "Skeleton");
                    return;
                }
            }

            if (choice.Target === 'Sail') {
                this.engine.keys.sail = true;
            }
            
            if (choice.Target === 'Eat') {
                this.engine.keys.food = true;
            }

            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');