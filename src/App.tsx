import React, {FormEvent, useState} from 'react';
import {Button, Col, Container, FloatingLabel, Form, FormControl, InputGroup, Row} from "react-bootstrap";

interface FoundFrequency {
    freq: number
    top: number
    div: number
    frac: number
}

function Result(f: FoundFrequency) {
    return <Row>

        <Col md={4}>
            <InputGroup className="mb-3" size={"sm"}>
                <InputGroup.Text>Frequency:</InputGroup.Text>
                <FormControl aria-label="Top register" readOnly={true} value={f.freq}/>
            </InputGroup>
        </Col>
        <Col md={8}>
            <Row>
                <Col md={6}>
                    <InputGroup className="mb-3" size={"sm"}>
                        <InputGroup.Text>TOP:</InputGroup.Text>
                        <FormControl aria-label="Top register" readOnly={true} value={f.top}/>
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup className="mb-3" size={"sm"}>
                        <InputGroup.Text>Div:</InputGroup.Text>
                        <FormControl aria-label="Top register" readOnly={true} value={f.div}/>
                        <InputGroup.Text>Frac:</InputGroup.Text>
                        <FormControl aria-label="Top register" readOnly={true} value={f.frac}/>
                    </InputGroup>
                </Col>
            </Row>
        </Col>

    </Row>
}

function App() {

    const [frequency, setFrequency] = useState<number>(0);
    const [searching, setSearching] = useState<boolean>(false)

    const [showResultsCount, setShowResultCount] = useState<number>(5)

    const [sysFrequency, setSysFrequency] = useState<number>(125000000)
    const [minTop, setMinTop] = useState<number | undefined>(0)
    const [maxTop, setMaxTop] = useState<number | undefined>(65535)

    const [foundFrequencies, setFoundFrequencies] = useState<FoundFrequency[]>([])

    const calcPeriod = (t: number, d: number, df: number) => (t + 1) * (d + (df / 16))

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let freq = 0;

        let found = false;
        const updatedState = [];
        setFoundFrequencies([])
        if (minTop === undefined || maxTop === undefined) {
            return;
        }

        setSearching(true);

        for (let top = minTop; top <= maxTop; top++) {
            for (let div = 1; div < 255; div++) {

                for (let frac = 0; frac < 15; frac++) {

                    const temp = Math.round(sysFrequency / calcPeriod(top, div, frac));
                    if (Math.abs(temp - frequency) < Math.abs(freq - frequency)) {
                        freq = temp
                        updatedState.push({
                            freq,
                            top,
                            div,
                            frac
                        })
                    }
                }
            }
        }

        setFoundFrequencies(updatedState.reverse());

        setSearching(false);

    }

    return (
        <Container>
            <h2>Calculate Top, div and Div Frac for specific frequency.</h2>
            <h3>Add a frequency.</h3>
            <Row className={"mt-5"}>
                <Col md={8}>
                    <Form onSubmit={(e) => submitForm(e)}>

                        <InputGroup className="mb-3" size={"lg"}>
                            <InputGroup.Text>Frequency:</InputGroup.Text>
                            <FormControl
                                type={"number"}
                                required
                                onChange={(e) => setFrequency(parseInt(e.currentTarget.value))}
                                placeholder="ex: 12000"
                                aria-label="Frequency"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Text>Hz</InputGroup.Text>
                            <Button
                                variant="outline-secondary"
                                type={"submit"}>
                                Calculate
                            </Button>
                        </InputGroup>
                    </Form>
                    <Row className={"mt-4"}>
                        <Col>
                            {searching && <h3>Searching...</h3>}
                            {foundFrequencies.length > 0 && <div>
                                <h3>Results:</h3>
                                {foundFrequencies.slice(0, showResultsCount).map((value, index) => <Result
                                    freq={value.freq} top={value.top}
                                    div={value.div} frac={value.frac}
                                    key={index}/>)}
                            </div>}

                            {foundFrequencies.length > showResultsCount &&
                            <a onClick={() => setShowResultCount(prevState => prevState + 5)}>Show additional</a>}

                        </Col>
                    </Row>
                </Col>
                <Col/>
                <Col md={3}>

                    <h4>Config:</h4>
                    <Row>
                        <Col md={12}>

                            <h6>Range TOP Register</h6>
                            <InputGroup className="mb-3" size={"sm"}>

                                <FormControl
                                    onChange={(e) => setMinTop(e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined)}
                                    placeholder={"0"}
                                    aria-label="Min Top"
                                    value={minTop ?? ''}
                                />
                                <InputGroup.Text>-</InputGroup.Text>
                                <FormControl
                                    onChange={(e) => setMaxTop(e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined)}
                                    placeholder={"65535"}
                                    aria-label="System Frequency"
                                    value={maxTop ?? ''}
                                />
                            </InputGroup>
                            <h6>System Frequency</h6>
                            <InputGroup className="mb-3" size={"sm"}>
                                <FormControl
                                    onChange={(e) => setSysFrequency(parseInt(e.currentTarget.value))}
                                    placeholder="125000000"
                                    aria-label="System Frequency"
                                    value={sysFrequency}
                                />
                                <InputGroup.Text>Hz</InputGroup.Text>
                            </InputGroup>


                        </Col>
                    </Row>

                </Col>
            </Row>
        </Container>
    );
}

export default App;
