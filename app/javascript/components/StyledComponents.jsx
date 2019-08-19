import styled from "styled-components"
import { Container, Segment, Card, Icon } from "semantic-ui-react"
import React from "react"

export const Jumbotron = styled.div`
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
     background: ${props => `url('${props.src}')`};
     height: ${props => props.fullHeight ? "100vh !important" : "40vh"};

    display: grid;
}
`
export const JumboMessage = styled.div`
    background-color: rgba(0,0,0,0) !important;
    align-self: end;
    justify-self: center;
    padding: 1rem;

`

export const ThreeColumnContainer = styled(Container)`
    padding: 1rem;
    display: grid !important;
    // grid-template-columns: repeat( auto-fill, minmax(14rem, 1fr)) ;
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

export const QuoteContainer = styled.div`
  border-left: .5rem solid  	#8EC03E;
  padding-left: .5rem;
  display: grid;
  grid-gap: .5rem;
  margin: 0 0 1rem -1rem;
  color:  	grey;
  font-size: 1.5rem;
  width: 50rem;
  max-width: 100%;
  grid-area: quote;
`

export const Quote = (props) => {
    return <QuoteContainer >
        <Icon size="big" style={{ color: "grey" }} name="quote left" />
        {props.children}
        {props.cite ?
            <small>- {props.cite}</small>
            : null
        }
    </QuoteContainer>
}

export const InfoContainer = styled(Container)`
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        grid-gap: 1rem;
        grid-template-areas:
        "header header"
        "p1 p1"
        "quote quote"
        "p2 p2"
        "p3 p3"
        
        ;
    `

export const ImageDiv = styled.div`
        width: ${props => props.width || "auto"} ;
        height: ${props => props.height || "auto"};
        background: ${props => `url('${props.src}')`};
        background-size: cover;
        grid-area: ${props => `${props.gridArea}`};
        background-position: center;

    `
export const TwoColumnContainer = styled(Container)`
        grid-template-rows: auto 1fr;
        display: grid !important;
        justify-contentt: center;
        grid-template-columns: 2fr 3fr;
        grid-template-areas: "heading ." "p1 img";
        margin-top: 2rem;
        grid-column-gap: 1rem;

    `
