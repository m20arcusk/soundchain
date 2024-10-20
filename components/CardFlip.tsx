import React from 'react';
import ReactCardFlip from 'react-card-flip';
import MultiActionAreaCard from '@/components/Card';
import Contribute from '@/components/Contribute';

// Define the props type for CardFlip component
interface CardFlipProps {
  projectTitle: string;
  audioLink: string;
  completionPercentage: number;
}

// Define the state type
interface AppState {
  isFlipped: boolean;
}

class CardFlip extends React.Component<CardFlipProps, AppState> {
  constructor(props: CardFlipProps) {
    super(props);
    this.state = {
      isFlipped: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  render() {
    const { isFlipped } = this.state;
    const { projectTitle, audioLink, completionPercentage } = this.props;

    return (
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front Side */}
        <div key="front">
          <MultiActionAreaCard 
            projectTitle={projectTitle} 
            audioLink={audioLink} 
            completionPercentage={completionPercentage}
            onSupportClick={this.handleClick}
          />
        </div>

        {/* Back Side */}
        <div key="back">
          <Contribute 
            projectTitle={projectTitle}
            completionPercentage={completionPercentage} 
          />
        </div>
      </ReactCardFlip>
    );
  }
}

export default CardFlip;