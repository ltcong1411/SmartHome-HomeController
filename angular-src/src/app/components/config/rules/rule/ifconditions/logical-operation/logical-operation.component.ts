import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { RuleService } from '../../../../../../services/rest-api/rule.service';

@Component({
  selector: 'app-logical-operation',
  templateUrl: './logical-operation.component.html',
  styleUrls: ['./logical-operation.component.css']
})
export class LogicalOperationComponent implements OnInit, OnChanges {
  @Input() ruleId;
  @Input() operation;
  @Input() listOfDevicesInHouse;
  @Input() listOfUsers;
  @Input() editHidden;
  @Output() deleteOperationEvent = new EventEmitter<Object>();
  @Output() addOperationEvent = new EventEmitter<Object>();
  @Output() updateOperationEvent = new EventEmitter<Object>();

  constructor(
    private ruleService: RuleService
  ) { }
  //
  // operation: {
  //   _1stOperand: Object,
  //   _2ndOperand: Object,
  //   operator: String
  // };
  isDataAvailable = false;
  _1stOperandType = '';
  _2ndOperandType = '';
  _1stOperand: String;
  _2ndOperand: String;
  operator = '';

  ngOnInit() {
    if((!!this.operation._1stOperand)&&(!!this.operation._2ndOperand)){
      this._1stOperandType = this.operation._1stOperand._type;
      this._2ndOperandType = this.operation._2ndOperand._type;
      this._1stOperand = this.operation._1stOperand;
      this._2ndOperand = this.operation._2ndOperand;
      this.operator = this.operation.operator;
      this.isDataAvailable = true;
    }
  }

  ngOnChanges(){
    if((!!this.operation._1stOperand)&&(!!this.operation._2ndOperand)){
      this._1stOperandType = this.operation._1stOperand._type;
      this._2ndOperandType = this.operation._2ndOperand._type;
      this._1stOperand = this.operation._1stOperand;
      this._2ndOperand = this.operation._2ndOperand;
      this.operator = this.operation.operator;
    }
  }

  deleteOperation(operand, operation){
    let msg = {
      operand: operand,
      operation: operation
    }
    this.deleteOperationEvent.emit(msg);
  }

  addOperation(operand){
    let msg = {
      operand: operand
    }
    this.addOperationEvent.emit(msg);
  }

  updateOperation(operand, operation){
    this.operation[operand] = operation;
    this.updateOperationEvent.emit(this.operation);
  }

  selectOperator(operator){
    this.operation.operator = this.operator = operator;
    this.updateOperationEvent.emit(this.operation);
  }

}
