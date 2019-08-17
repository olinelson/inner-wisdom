import styled from "styled-components"
import { Container, Segment, Card } from "semantic-ui-react"

export const Jumbotron = styled.div`
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    height: 70vh !important;
    margin: -2rem 0 0 0 !important;

    border: none !important;
    border-radius: 0 !important;
    margin-top: -1rem !important;
    display: grid;
    align-items: center;
    justify-content: center;
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


