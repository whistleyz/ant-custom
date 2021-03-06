import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import createDOMForm from 'rc-form/lib/createDOMForm';
import createFormField from 'rc-form/lib/createFormField';
import omit from 'omit.js';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { ColProps } from '../grid/col';
import { tuple } from '../_util/type';
import warning from '../_util/warning';
import FormItem, { FormLabelAlign } from './FormItem';
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants';
import FormContext from './context';
import { FormWrappedProps } from './interface';

type FormCreateOptionMessagesCallback = (...args: any[]) => string;

interface FormCreateOptionMessages {
  [messageId: string]: string | FormCreateOptionMessagesCallback | FormCreateOptionMessages;
}

export interface FormCreateOption<T> {
  onFieldsChange?: (props: T, fields: any, allFields: any) => void;
  onValuesChange?: (props: T, changedValues: any, allValues: any) => void;
  mapPropsToFields?: (props: T) => void;
  validateMessages?: FormCreateOptionMessages;
  withRef?: boolean;
  name?: string;
}

const FormLayouts = tuple('horizontal', 'inline', 'vertical');
export type FormLayout = (typeof FormLayouts)[number];

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  layout?: FormLayout;
  form?: WrappedFormUtils;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  style?: React.CSSProperties;
  className?: string;
  prefixCls?: string;
  hideRequiredMark?: boolean;
  /**
   * @since 3.14.0
   */
  wrapperCol?: ColProps;
  labelCol?: ColProps;
  /**
   * @since 3.15.0
   */
  colon?: boolean;
  labelAlign?: FormLabelAlign;
}

export type ValidationRule = {
  /** validation error message */
  message?: React.ReactNode;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: string;
  /** indicates whether field is required */
  required?: boolean;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** validate the exact length of a field */
  len?: number;
  /** validate the min length of a field */
  min?: number;
  /** validate the max length of a field */
  max?: number;
  /** validate the value from a list of possible values */
  enum?: string | string[];
  /** validate from a regular expression */
  pattern?: RegExp;
  /** transform a value before validation */
  transform?: (value: any) => any;
  /** custom validate function (Note: callback must be called) */
  validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;
};

export type ValidateCallback<V> = (errors: any, values: V) => void;

export type GetFieldDecoratorOptions = {
  /** ?????????????????????????????? Checkbox ?????? 'checked' */
  valuePropName?: string;
  /** ??????????????????????????????????????????????????????????????? */
  initialValue?: any;
  /** ?????????????????????????????? */
  trigger?: string;
  /** ????????? onChange ??????????????????????????????????????? DatePicker ????????????(date, dateString) => dateString */
  getValueFromEvent?: (...args: any[]) => any;
  /** Get the component props according to field value. */
  getValueProps?: (value: any) => any;
  /** ??????????????????????????? */
  validateTrigger?: string | string[];
  /** ????????????????????? [async-validator](https://github.com/yiminghe/async-validator) */
  rules?: ValidationRule[];
  /** ?????????????????????????????????????????? Radio ???????????? */
  exclusive?: boolean;
  /** Normalize value to form component */
  normalize?: (value: any, prevValue: any, allValues: any) => any;
  /** Whether stop validate on first rule of error for this field.  */
  validateFirst?: boolean;
  /** ???????????????????????????????????? */
  preserve?: boolean;
};

/** dom-scroll-into-view ?????????????????? */
export type DomScrollIntoViewConfig = {
  /** ???????????????????????? */
  alignWithLeft?: boolean;
  /** ????????????????????????  */
  alignWithTop?: boolean;
  /** ??????????????? */
  offsetTop?: number;
  /** ??????????????? */
  offsetLeft?: number;
  /** ??????????????? */
  offsetBottom?: number;
  /** ??????????????? */
  offsetRight?: number;
  /** ?????????????????????????????? */
  allowHorizontalScroll?: boolean;
  /** ?????????????????????????????????????????? */
  onlyScrollIfNeeded?: boolean;
};

export type ValidateFieldsOptions = {
  /** ???????????????????????????????????????????????????????????????????????? */
  first?: boolean;
  /** ???????????????????????????????????????????????????????????????????????? */
  firstFields?: string[];
  /** ????????????????????????????????? validateTrigger ???????????????????????????????????? */
  force?: boolean;
  /** ?????? validateFieldsAndScroll ??????????????? */
  scroll?: DomScrollIntoViewConfig;
};

// function create
export type WrappedFormUtils<V = any> = {
  /** ????????????????????????????????????????????????????????????????????????????????? */
  getFieldsValue(fieldNames?: Array<string>): { [field: string]: any };
  /** ?????????????????????????????? */
  getFieldValue(fieldName: string): any;
  /** ?????????????????????????????? */
  setFieldsValue(obj: Object, callback?: Function): void;
  /** ?????????????????????????????? */
  setFields(obj: Object): void;
  /** ??????????????????????????????????????? Error */
  validateFields(
    fieldNames: Array<string>,
    options: ValidateFieldsOptions,
    callback: ValidateCallback<V>,
  ): void;
  validateFields(options: ValidateFieldsOptions, callback: ValidateCallback<V>): void;
  validateFields(fieldNames: Array<string>, callback: ValidateCallback<V>): void;
  validateFields(fieldNames: Array<string>, options: ValidateFieldsOptions): void;
  validateFields(fieldNames: Array<string>): void;
  validateFields(callback: ValidateCallback<V>): void;
  validateFields(options: ValidateFieldsOptions): void;
  validateFields(): void;
  /** ??? `validateFields` ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
  validateFieldsAndScroll(
    fieldNames: Array<string>,
    options: ValidateFieldsOptions,
    callback: ValidateCallback<V>,
  ): void;
  validateFieldsAndScroll(options: ValidateFieldsOptions, callback: ValidateCallback<V>): void;
  validateFieldsAndScroll(fieldNames: Array<string>, callback: ValidateCallback<V>): void;
  validateFieldsAndScroll(fieldNames: Array<string>, options: ValidateFieldsOptions): void;
  validateFieldsAndScroll(fieldNames: Array<string>): void;
  validateFieldsAndScroll(callback: ValidateCallback<V>): void;
  validateFieldsAndScroll(options: ValidateFieldsOptions): void;
  validateFieldsAndScroll(): void;
  /** ??????????????????????????? Error */
  getFieldError(name: string): string[] | undefined;
  getFieldsError(names?: Array<string>): Record<string, string[] | undefined>;
  /** ????????????????????????????????????????????? */
  isFieldValidating(name: string): boolean;
  isFieldTouched(name: string): boolean;
  isFieldsTouched(names?: Array<string>): boolean;
  /** ???????????????????????????????????????????????????????????????????????????????????? */
  resetFields(names?: Array<string>): void;
  // tslint:disable-next-line:max-line-length
  getFieldDecorator<T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions,
  ): (node: React.ReactNode) => React.ReactNode;
};

export interface WrappedFormInternalProps<V = any> {
  form: WrappedFormUtils<V>;
}

export interface RcBaseFormProps {
  wrappedComponentRef?: any;
}

export interface FormComponentProps<V = any> extends WrappedFormInternalProps<V>, RcBaseFormProps {
  form: WrappedFormUtils<V>;
}

export default class Form extends React.Component<FormProps, any> {
  static defaultProps = {
    colon: true,
    layout: 'horizontal' as FormLayout,
    hideRequiredMark: false,
    onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
    },
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    layout: PropTypes.oneOf(FormLayouts),
    children: PropTypes.any,
    onSubmit: PropTypes.func,
    hideRequiredMark: PropTypes.bool,
    colon: PropTypes.bool,
  };

  static Item = FormItem;

  static createFormField = createFormField;

  static create = function create<TOwnProps extends FormComponentProps>(
    options: FormCreateOption<TOwnProps> = {},
  ): FormWrappedProps<TOwnProps> {
    return createDOMForm({
      fieldNameProp: 'id',
      ...options,
      fieldMetaProp: FIELD_META_PROP,
      fieldDataProp: FIELD_DATA_PROP,
    });
  };

  constructor(props: FormProps) {
    super(props);

    warning(!props.form, 'Form', 'It is unnecessary to pass `form` to `Form` after antd@1.7.0.');
  }

  renderForm = ({ getPrefixCls }: ConfigConsumerProps) => {
    const { prefixCls: customizePrefixCls, hideRequiredMark, className = '', layout } = this.props;
    const prefixCls = getPrefixCls('form', customizePrefixCls);
    const formClassName = classNames(
      prefixCls,
      {
        [`${prefixCls}-horizontal`]: layout === 'horizontal',
        [`${prefixCls}-vertical`]: layout === 'vertical',
        [`${prefixCls}-inline`]: layout === 'inline',
        [`${prefixCls}-hide-required-mark`]: hideRequiredMark,
      },
      className,
    );

    const formProps = omit(this.props, [
      'prefixCls',
      'className',
      'layout',
      'form',
      'hideRequiredMark',
      'wrapperCol',
      'labelAlign',
      'labelCol',
      'colon',
    ]);

    return <form {...formProps} className={formClassName} />;
  };

  render() {
    const { wrapperCol, labelAlign, labelCol, layout, colon } = this.props;
    return (
      <FormContext.Provider
        value={{ wrapperCol, labelAlign, labelCol, vertical: layout === 'vertical', colon }}
      >
        <ConfigConsumer>{this.renderForm}</ConfigConsumer>
      </FormContext.Provider>
    );
  }
}
