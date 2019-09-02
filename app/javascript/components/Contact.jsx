import React, { useEffect } from 'react'
import { Container, Divider, Embed, Grid } from 'semantic-ui-react';

export default function Contact() {

    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
        })
    }, []);

    return <Container text>
        <h1 >Contact</h1>
        <Divider />

        <Grid stackable columns={2} >
            <Grid.Row>
                <Grid.Column>
                    <h4>Email</h4>
                    <a href="mailto:innerwisdompsychologist@gmail.com">innerwisdompsychologist@gmail.com</a>
                    <h4>Phone</h4>
                    <a href="tel:+61401057778‬">0401 057 778‬</a>

                </Grid.Column>

                <Grid.Column>
                    <Embed aspectRatio='4:3' active url='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26547.89872365605!2d151.06351637981095!3d-33.72221217000799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a72389442869%3A0x5017d681632cd80!2sThornleigh+NSW+2120%2C+Australia!5e0!3m2!1sen!2sus!4v1566244045799!5m2!1sen!2sus' />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
}
