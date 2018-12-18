import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleService } from '../../../../../services/rest-api/rule.service';

@Component({
  selector: 'app-ifconditions',
  templateUrl: './ifconditions.component.html',
  styleUrls: ['./ifconditions.component.css']
})
export class IfconditionsComponent implements OnInit {
  @Input() ruleId;
  @Input() ifCondtions;
  @Input() listOfDevicesInHouse;
  @Input() listOfUsers;
  @Input() editHidden;
  @Output() updateIfCond = new EventEmitter<Object>();

  constructor(
    private ruleService: RuleService
  ) { }

  _type: String;
  operationId: Object;
  operation: any;
  ngOnInit() {
    if(!!this.ifCondtions){
      if(!!this.ifCondtions._type){
        this._type = this.ifCondtions._type;
        this.operation = this.ifCondtions;
      } else {
        this._type = 'RelationalOperation';
        this.operation = {
          _type: 'RelationalOperation',
          deviceId: null,
          operator: 'operator',
          value: 'value'
        }
      }
    } else {
      this._type = 'RelationalOperation';
      this.operation = {
        _type: 'RelationalOperation',
        deviceId: null,
        operator: 'operator',
        value: 'value'
      }
    }
  }

  delRelaOperation(operation){
    let newOperation = {
      _type: 'RelationalOperation',
      deviceId: null,
      operator: 'operator',
      value: 'value'
    };
    this.operation = newOperation;
    this.updateIfCond.emit(this.operation);
  }

  delLogiOperation(operation){
    let newOperation = {
                          _id: this.operation._id,
                          _type: this.operation._type,
                          _1stOperand: this.operation._1stOperand,
                          _2ndOperand: this.operation._2ndOperand,
                          operator: this.operation.operator
                        };
    switch(operation.operand){
      case '_1stOperand':
        switch(this.operation._1stOperand._type){
          case 'RelationalOperation':
            switch(this.operation._2ndOperand._type){
              case 'RelationalOperation':
                newOperation = this.operation._2ndOperand;
                break;
              case 'LogicalOperation':
                newOperation._1stOperand = this.operation._2ndOperand._1stOperand;
                newOperation._2ndOperand = this.operation._2ndOperand._2ndOperand;
                break;
            }
            break;
          case 'LogicalOperation':
            switch(operation.operation.operand){
              case '_1stOperand':
                newOperation._1stOperand = this.operation._1stOperand._2ndOperand;
                break;
              case '_2ndOperand':
                newOperation._1stOperand = this.operation._1stOperand._1stOperand;
                break;
            }
            break;
        }
        break;
      case '_2ndOperand':
        switch(this.operation._2ndOperand._type){
          case 'RelationalOperation':
            switch(this.operation._1stOperand._type){
              case 'RelationalOperation':
                newOperation = this.operation._1stOperand;
                break;
              case 'LogicalOperation':
                newOperation._2ndOperand = this.operation._1stOperand._2ndOperand;
                newOperation._1stOperand = this.operation._1stOperand._1stOperand;
                break;
            }
            break;
          case 'LogicalOperation':
            switch(operation.operation.operand){
              case '_1stOperand':
                newOperation._2ndOperand = this.operation._2ndOperand._2ndOperand;
                break;
              case '_2ndOperand':
                newOperation._2ndOperand = this.operation._2ndOperand._1stOperand;
                break;
            }
            break;
        }
        break;
    }
    this._type = newOperation._type;
    this.operation = newOperation;
    this.updateIfCond.emit(this.operation);
  }

  addLogiOperation(msg){
    let newOperation = {
                          _id: this.operation._id,
                          _type: this.operation._type,
                          _1stOperand: this.operation._1stOperand,
                          _2ndOperand: this.operation._2ndOperand,
                          operator: this.operation.operator
                        };
    let newRelationalOperation = {
      _type: 'RelationalOperation',
      deviceId: null,
      operator: 'operator',
      value: 'value'
    }
    switch(msg.operand){
      case '_1stOperand':
        newOperation._1stOperand = {
          _type: 'LogicalOperation',
          _1stOperand: this.operation._1stOperand,
          _2ndOperand: newRelationalOperation,
          operator: 'operator'
        }
        break;
      case '_2ndOperand':
        newOperation._2ndOperand = {
          _type: 'LogicalOperation',
          _1stOperand: this.operation._2ndOperand,
          _2ndOperand: newRelationalOperation,
          operator: 'operator'
        }
        break;
    }
    this.operation = newOperation;
    this.updateIfCond.emit(this.operation);
  }

  addRelaOperation(msg){
    let newRelationalOperation = {
      _type: 'RelationalOperation',
      deviceId: null,
      operator: 'operator',
      value: 'value'
    }
    let newOperation = {
                          _type: 'LogicalOperation',
                          _1stOperand: this.operation,
                          _2ndOperand: newRelationalOperation,
                          operator: 'operator'
                        };
    this._type = 'LogicalOperation';
    this.operation = newOperation;
    this.updateIfCond.emit(this.operation);
  }

  updateOperation(operation){
    this.operation = operation;
    this.updateIfCond.emit(this.operation);
  }
}
