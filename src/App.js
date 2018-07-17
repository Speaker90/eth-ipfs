import React, { Component } from 'react';
import { Button,Grid,Form,Table } from 'react-bootstrap';
import axios from 'axios'
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';





class App extends Component {
    
    state={
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      uploadTime:''
    };

    captureFile = (event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => this.convertToBuffer(reader)    
    };
         
    convertToBuffer = async(reader) => {
      var buffer = await Buffer.from(reader.result);
      this.setState({buffer});
    };

    onSubmit = async (event)  => {
      event.preventDefault()
      const accounts = await web3.eth.getAccounts();

      console.log('Sending from Meta Mask account ' + accounts[0]);
      
      const ethAddress=storehash.options.address;
      this.setState({ethAddress});

      await ipfs.add(this.state.buffer, (err,ipfsHash) => {
        console.log(err,ipfsHash);
        this.setState({ipfsHash:ipfsHash[0].hash});
      

      storehash.methods.sendHash(this.state.ipfsHash).send({
        from: accounts[0],
      }, (error, transactionHash)=>{
          console.log(error,transactionHash);
        }); //storehash
      
      storehash.events.TimeAdded((error,result)=>{
        console.log(error,result);
      });
      }); //ipfs.add
    };//onSubmit 

   onShow = async (event) => {
      event.preventDefault()
      const accounts = await web3.eth.getAccounts();

      console.log('Requesting from Meta Mask account ' + accounts[0]);

      const ethAddress=storehash.options.address;
      this.setState({ethAddress});

      await storehash.methods.getHash().call({
        from: accounts[0], 
      },(error,result)=>{
        console.log(error,result);
        this.setState({ipfsHash:result[0]})
        const uploadTime=(new Date(result[1]*1000)).toString();
        console.log(uploadTime);
  
        this.setState({uploadTime})
    });//storehash
  };//onClick2

  onDownload = async(event) => {
    event.preventDefault()
    await this.onShow(event)
    const url="http://localhost:8080/ipfs/"+this.state.ipfsHash;
    axios({
      url: url,
      method: 'GET',
      responseType: 'text', 
    }).then((response) => {
      const element = document.createElement('a');
      element.setAttribute('href', response.data); 
      element.setAttribute('download', 'file');
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
    
  }

 
    
      render() {
    return (
       <div className="App">
          <header className="App-header">
            <h1> Ethereum and IPFS with Create React App</h1>
          </header>
          
          <hr />
          <Grid>
          <h3> Choose file to send to IPFS </h3>
          <Form onSubmit={this.onSubmit}>
            <input 
              type = "file"
              onChange = {this.captureFile}
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Send it 
             </Button>
          </Form>
<hr/>
 
            <Button onClick = {this.onShow}> Show Current Hash stored </Button>
  <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>
               
                <tbody>
                  <tr>
                    <td>IPFS Hash # stored on Eth Contract</td>
                    <td>{this.state.ipfsHash}</td>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                  </tr>
                  <tr>
                    <td>Upload Time</td>
                    <td>{this.state.uploadTime}</td>
                  </tr>
                
                </tbody>
            </Table>
            <Button onClick = {this.onDownload}> Download File </Button>
        </Grid>
     </div>
    );
  } //render
} //App

export default App;
