import React, { Component } from 'react'
import { withRouter } from 'react-router-dom' 

class About extends Component {
    render() {
        return(
            <div style={{margin: '0px 5%', background: 'white'}}> 
                <h5>HISTORY</h5>
                <p>
                    The National Institute of Molecular Biology and Biotechnology (BIOTECH) , 
                    formerly known as the National Institutes of Biotechnology and Applied Microbiology, 
                    was established on December 20, 1979 by the UP Board of Regents as a research and development institution
                    based at UP Los Baños. Letter of Instruction No. 1005 from then President Ferdinand E. Marcos
                    on March 1980 instructed the National Treasury to release P10 million out of the Energy Special Fund 
                    for the institute. BIOTECH originally served as an integrating mechanism to mobilize the 
                    various departments and disciplines in engineering, chemistry and applied microbiology for research, 
                    training, and extension.
                </p>
                <p>
                    BIOTECH serves as the national research and development (R&D) organization specializing in 
                    agricultural, environmental, food and feeds, and health biotechnology. The institute capitalizes on 
                    the use of the country's diverse collection of microorganisms, rich natural resources and 
                    agro-industrial waste and by-products to develop and advance alternative technologies and 
                    products towards improved agro-industrial productivity.
                </p>
                <br></br>

                <h5>VISION</h5>
                <p>
                    BIOTECH as a premier R & D institution for basic and applied researches on molecular biology and 
                    biotechnology addressing the needs related to agriculture, forestry, environment, energy and industry 
                    that will have positive impact to society.
                </p>
                <br></br>
                
                <h5>MISSION</h5>
                <p>To develop cost-effective and environment-friendly technologies for the production of goods and services 
                    that are comparable or better alternatives to conventional products for their use in the following 
                    sectors: agriculture, forestry, environment, energy and industry.
                </p>
                <br></br>

                <h5>GOALS</h5>
                <ul>
                    <li>To contribute to increased productivity and global competitiveness of commodities through the creation of high-value products, processes and services;</li>
                    <li>To lead in the use, protection and conservation of biodiversity especially microbial resources;</li>
                    <li>To be at the forefront in waste management research through biotechnology;</li>
                    <li>To develop a nationally recognized information and education center on biotechnology;</li>
                    <li>To fast track commercialization and transfer of biotechnologies through models, mechanisms and policy instruments; and,</li>
                    <li>To efficiently and effectively manage BIOTECH as a research, development, service, and extension (RDE) organization.</li>
                </ul>
            </div>
        ) ;
    }
}

export default withRouter(About);