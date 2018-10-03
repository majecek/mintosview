import React, {Component} from 'react'
import XLSX from 'xlsx'

class SheetJSApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // data: [],
            // cols: []
            data: [
                    // ["Transaction ID", "Date", "Details", "Turnover", "Balance", "Currency"],
                    ["231572896", "2018-01-06 23:30:00", "Interest income Loan ID: 2005086-01", "0.127777778", "0.127777778", "EUR"],
                    ["231573090", "2018-01-06 23:30:00", "Investment principal repayment Loan ID: 2005086-01", "0.798120798", "0.925898576", "EUR"]
            ], /* Array of Arrays e.g. [["a","b"],[1,2]] */
            cols: [
                {name: "A", key: 0},
                {name: "B", key: 1},
                {name: "C", key: 2},
                {name: "D", key: 3},
                {name: "E", key: 4},
                {name: "F", key: 5}
            ]  /* Array of column objects e.g. { name: "C", K: 2 } */
        };
        this.handleFile = this.handleFile.bind(this);
        this.exportFile = this.exportFile.bind(this);
        this.process = this.process.bind(this)
    }

    /*
     ["Transaction ID", "Date", "Details", "Turnover", "Balance", "Currency"]
 ["231572896", "2018-01-06 23:30:00", "Interest income Loan ID: 2005086-01", "0.127777778", "0.127777778", "EUR"]
 ["231573090", "2018-01-06 23:30:00", "Investment principal repayment Loan ID: 2005086-01", "0.798120798", "0.925898576", "EUR"]

{name: "A", key: 0}
{name: "B", key: 1}
{name: "C", key: 2}
{name: "D", key: 3}
{name: "E", key: 4}
{name: "F", key: 5}
     */


    handleFile(file/*:File*/) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log("data:", data)
            /* Update state */
            this.setState({data: data, cols: make_cols(ws['!ref'])});
            // this.setState({data: data});
            // console.log(this.state.data)
            // console.log(this.state.cols)
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);

        this.process()
    }

    process() {
        const data = this.state.data;
        console.log(data)
        data.map(row => {
            console.log("==================")
            const loanIDIndex = row[2].indexOf("Loan ID:")
            const loanID = row[2].substr(loanIDIndex + 9)
            console.log("loanID: ",loanID)
            console.log("transactionID: ",row[0])
            console.log("date: ",row[1])
            console.log("text: ",row[2])
            console.log("action: ",row[2].substring(0,loanIDIndex))
            console.log("turnover: ",row[3])
            console.log("curency: ",row[5])
            console.log()
            // row.map(col => {
            //     console.log(col)
            // })
        })
    }

    exportFile() {
        /* convert state to workbook */
        const ws = XLSX.utils.aoa_to_sheet(this.state.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "sheetjs.xlsx")
    }


    /* generate an array of column objects */


    render() {

        this.process()

        return (
            <DragDropFile handleFile={this.handleFile}>
                <div className="row">
                    <div className="col-xs-12">
                        <DataInput handleFile={this.handleFile}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <button disabled={!this.state.data.length} className="btn btn-success"
                                onClick={this.exportFile}>Export
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <OutTable data={this.state.data} cols={this.state.cols}/>
                    </div>
                </div>
            </DragDropFile>
        );
    };

}

export default SheetJSApp


class OutTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>{this.props.cols.map((c) => <th key={c.key}>{c.name}</th>)}</tr>
                    </thead>
                    <tbody>
                    {this.props.data.map((r, i) => <tr key={i}>
                        {this.props.cols.map(c => <td key={c.key}>{r[c.key]}</td>)}
                    </tr>)}
                    </tbody>
                </table>
            </div>
        );
    };
}


/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
class DragDropFile extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    };

    suppress(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };

    onDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        const files = evt.dataTransfer.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    };

    render() {
        return (
            <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
                {this.props.children}
            </div>
        );
    };
}


/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
class DataInput extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    };

    render() {
        return (
            <form className="form-inline">
                <div className="form-group">
                    <label htmlFor="file">Spreadsheet</label>
                    <input type="file" className="form-control" id="file" accept={SheetJSFT}
                           onChange={this.handleChange}/>
                </div>
            </form>
        );
    };
}


/* list of supported file types */
const SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) {
    return "." + x;
}).join(",");

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
    return o;
};