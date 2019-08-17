import styled from "styled-components"
import { Container, Segment, Card, Icon } from "semantic-ui-react"
import React from "react"

export const Jumbotron = styled.div`
    background-position: center;
    background-size: cover !important;
    background-repeat: no-repeat !important;
     background: ${props => `url('${props.src}')`};
    height: ${props => props.fullHeight ? "100vh !important" : "40vh"};

    display: grid;
    // align-items: center;
    // justify-content: center;
}
`
export const JumboMessage = styled(Segment)`
    background-color: rgba(0,0,0,0) !important;
    border: none !important;
`

export const ThreeColumnContainer = styled(Container)`
    padding: 1rem;
    display: grid !important;
    // grid-template-columns: repeat( auto-fit, minmax(15rem, 1fr)) ;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    grid-gap: 2rem;
    align-items: flex-end;
    text-align: center;
    @media(max-width: 400px){
        grid-template-columns: 1fr;
    }


`


export const GridCard = styled(Card)`
    margin: 0 !important;
`

export const ImageDivider = styled.div`
    background: ${props => `url('${props.src}')`};
    background-size: cover;
    height: 30vh;
    background-position: center;
    margin: 2rem 0;
`

export const QuoteContainer = styled.blockquote`
  border-left: .5rem solid  	#8EC03E;
  padding-left: .5rem;
  display: grid;
  grid-gap: .5rem;
  margin: 2rem -1rem;
  color:  	grey;
  font-size: 1.5rem;
`

export const Quote = (props) => {
    return <QuoteContainer>
        <Icon size="big" style={{ color: "grey" }} name="quote left" />
        {props.children}
        {props.cite ?
            <small>- {props.cite}</small>
            : null
        }
    </QuoteContainer>
}


