import React from 'react';
import { Button, Table, Divider, Form, Input, Card, message ,Statistic, Row, Col, Icon } from 'antd'
import { ColumnProps } from "antd/lib/table/interface"
import AddModal from './Add'


import './App.css';

const FormItem = Form.Item;

interface ItemData {
  id: number;
  dockPn: string;
  dockDescription: number;
  compatibilityPn: string;
  compDescription: string,
  footNoteId: string,
  footNoteText: string
}

export default class App extends React.Component {

  state = {
    data: [],
    record: {},
    selectedRowKeys: [], // Check here to configure the default column

    visible: false,
    loading: false,
    title: "",
    display: "none",
    //查询条件
    dpn: "",
    cpn: ""
  };



  componentDidMount() {
    this.getDataList();
  }

  getDataList(): void {
    const { dpn, cpn } = this.state;
    if (dpn.length > 2 && cpn.length >2){
        fetch(`http://localhost:8081/select?dpn=${dpn}&cpn=${cpn}`).then(response => response.json())
            .then(data => this.setState({ data: data }))
            .catch(e => message.error("Please enter correct "))
    }

  }

  onSelectChange = (selectedRowKeys: any) => {

    this.setState({ selectedRowKeys });
  };


  /**
   * 全部删除
   */
  deleteAll() {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error("请选中删除的数据!")
      return;
    }
    fetch("http://localhost:8081/delete?idarr=" + selectedRowKeys.toString())
      .then((data: any) => {
        if (data.status !== 200) {
          message.error(data.message);
          return
        } else {
          this.getDataList();
          this.setState({ selectedRowKeys: [] })
        }
      })
      .catch(e => message.error("网络错误"))
  }

  //返回添加删除视图
  renderFooter() {

    return (
      <Form layout="inline">


          {/*{this.state.selectedRowKeys.length ===0 ? <Button type="default" disabled={true}>Delete</Button>:<Button type="default" onClick={() => this.deleteAll()}>Delete</Button>}*/}
          <FormItem>
              {/*<Button type="default" onClick={() => this.deleteAll()}>Delete</Button>*/}
              {this.state.selectedRowKeys.length ===0 ? <Button  type="default" disabled={true}>Delete</Button> : <Button type="default" onClick={() => this.deleteAll()}>Delete</Button>}
          </FormItem>
        <FormItem>
          {/*<Button icon="plus" onClick={() => this.setState({ visible: true, records: {},title :"Add Dock" })}>Add</Button>*/}
            {this.state.selectedRowKeys.length === 1?
                <Button onClick={() => this.setState({ records: {}, visible: true ,title: "Edit Dock"})}>Edit</Button> :
                    <Button icon="plus"  onClick={() => this.setState({ visible: true, records: {},title :"Add Dock" })}>Add</Button>}
        </FormItem>

      </Form>
    )
  }


  /**
   * 删除
   * @param {*} id 
   */
  delete(id: number) {
    fetch("http://localhost:8081/delete?idarr=" + id.toString())
      .then((data: any) => {
        if (data.status !== 200) {
          message.error(data.message);
          return
        }
        this.getDataList()

      })
      .catch(e => console.log("Oops, error", e))
  }


  render() {
    const { record, selectedRowKeys, visible, data, cpn, dpn } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;




    const columns: Array<ColumnProps<ItemData>> = [
      {
        title: 'Dock PN',
        dataIndex: 'dockPn',
      },
      {
        title: 'DockDescription',
        dataIndex: 'dockDescription',
      },
      {
        title: 'CompatibilityPn',
        dataIndex: 'compatibilityPn',
      },
      {
        title: 'CompDescription',
        dataIndex: 'compDescription'
      },
      {
        title: 'FootNoteId',
        dataIndex: 'footNoteId',
      },
      {
        title: 'FootNoteText',
        dataIndex: 'footNoteText',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: ItemData) => (
          <span>
            <span onClick={() => this.setState({ record: record, visible: true ,title: "Edit Dock"})}>修改</span>
            <Divider type="vertical" />
            <span onClick={() => this.delete(record.id)}>删除</span>
          </span>
        ),
      },
    ];


    return (
      <div>
        <div style={{ marginBottom: 16 ,marginLeft:-17}}>

          <Card>
            <Form layout="inline">

                <div style={{ marginBottom:-15 }}>
                    <FormItem style={{ width: '14%' }} >
                        Dock PN
                    </FormItem>
                    <FormItem style={{ width: '10%' }} >
                        Compatibility PN
                    </FormItem>
                </div>
              <FormItem>
                <Input  value={dpn} placeholder={"Please input dock PN"} onChange={e => this.setState({ dpn: e.target.value })} />
              </FormItem>
              <FormItem>
                <Input  value={cpn} placeholder={"Please input part number"} onChange={e => this.setState({ cpn: e.target.value })} />
              </FormItem>
              <FormItem>
                <Button icon="search" onClick={() => this.getDataList()}>Search</Button>
              </FormItem>

            </Form>
          </Card>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>

        <Table rowSelection={rowSelection} columns={columns} dataSource={data} footer={() => this.renderFooter()} rowKey="id" />

        <AddModal visible={visible} record={record} title={this.state.title} onCancel={() => this.setState({ visible: false })} onOk={() => { this.getDataList(); this.setState({ visible: false }) }} />

      </div>
    );
  }
}
