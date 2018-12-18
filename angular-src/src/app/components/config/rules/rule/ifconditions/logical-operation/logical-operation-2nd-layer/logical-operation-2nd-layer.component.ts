import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleService } from '../../../../../../../services/rest-api/rule.service';

@Component({
  selector: 'app-logical-operation-2nd-layer',
  templateUrl: './logical-operation-2nd-layer.component.html',
  styleUrls: ['./logical-operation-2nd-layer.component.css']
})
export class LogicalOperation2ndLayerComponent implements OnInit {
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

  isDataAvailable = false;
  _1stOperand: String;
  _2ndOperand: String;
  operator: String;

  ngOnInit() {
    this._1stOperand = this.operation._1stOperand;
    this._2ndOperand = this.operation._2ndOperand;
    this.operator = this.operation.operator;
    this.isDataAvailable = true;

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
